import { ImageAnnotatorClient, protos } from '@google-cloud/vision'
import {
    ALBEventMultiValueQueryStringParameters,
    APIGatewayProxyHandler,
    APIGatewayProxyResult,
} from 'aws-lambda'
import { S3 } from 'aws-sdk'
import {
    LanguageCodeOrNull,
    LanguageCodeOrNullList,
    KeyList,
    GetLanguageQueryParameters,
} from 'types'

// Clients
const s3 = new S3()
const imageAnnotatorClient = new ImageAnnotatorClient()

export enum HttpStatusCodes {
    OK = 200,
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
}

export type ApiGatewayBody = ParsableObject | Error

export const getApiGatewayResponse = (statusCode: HttpStatusCodes) => (
    body?: ApiGatewayBody
): APIGatewayProxyResult => ({
    statusCode,
    body: JSON.stringify(body ?? {}),
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
})

export type TextDetectionResponse = [
    protos.google.cloud.vision.v1.IAnnotateImageResponse
]

export type TextDetectionResponseList = TextDetectionResponse[]

export const getQueryStrings = <
    QueryStringType extends Record<string, unknown>
>(event: {
    multiValueQueryStringParameters: ALBEventMultiValueQueryStringParameters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [name: string]: any
}): QueryStringType =>
        event.multiValueQueryStringParameters
            ? (event.multiValueQueryStringParameters as QueryStringType)
            : undefined

export type ParsableObject = Record<string, unknown>
export type HttpResponseFunction = () => APIGatewayProxyResult

export const getBadRequestResponse: HttpResponseFunction = getApiGatewayResponse(
    HttpStatusCodes.BAD_REQUEST
)

export const getOkResponse = (
    body?: ParsableObject
): HttpResponseFunction => () => getApiGatewayResponse(HttpStatusCodes.OK)(body)

export const getInternalServerResponse = (
    error?: Error
): HttpResponseFunction => () =>
    getApiGatewayResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR)(error)

export type GetSignedUrlFunction = (key: string) => Promise<string>

export const getSignedUrls = (
    execute: GetSignedUrlFunction,
    ...keys: KeyList
): Promise<string>[] => keys.map((key) => execute(key))

export type GetDetectedTextFunction = (
    url: string
) => Promise<TextDetectionResponse>

export const getLanguageCodes = async (
    execute: GetDetectedTextFunction,
    ...urls: string[]
): Promise<LanguageCodeOrNullList> => {
    const promises = urls.map((url) => execute(url))

    try {
        const responses = await Promise.all(promises)
        return responses.map((response) => parseTextResponse(response))
    } catch (error) {
        throw new Error(error)
    }
}

export const parseTextResponse = (
    response: TextDetectionResponse
): LanguageCodeOrNull => {
    const { languageCode = 'und' } =
        response?.[0]?.fullTextAnnotation?.pages?.[0]?.property
            ?.detectedLanguages?.[0] ?? {}

    return languageCode === 'und' ? null : languageCode
}

export const s3Execute = (key: string, client: S3 = s3): Promise<string> =>
    client.getSignedUrlPromise('getObject', {
        Key: key,
        Bucket: process.env.S3_BUCKET,
    })

export const visionExecute = (
    url: string,
    client: ImageAnnotatorClient = imageAnnotatorClient
): Promise<TextDetectionResponse> => client.textDetection(url)

export const getResponse = async (
    queryStrings?: GetLanguageQueryParameters
): Promise<HttpResponseFunction> => {
    if (!queryStrings) {
        return getBadRequestResponse
    }

    const { keys } = queryStrings

    try {
        const urls = await Promise.all(getSignedUrls(s3Execute, ...keys))

        const languageCodes = await getLanguageCodes(visionExecute, ...urls)

        return getOkResponse({ languageCodes })
    } catch (error) {
        return getInternalServerResponse(error)
    }
}

export const handler: APIGatewayProxyHandler = async (event) =>
    (await getResponse(getQueryStrings(event)))()
