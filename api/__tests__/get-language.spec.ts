import {
    getApiGatewayResponse,
    getBadRequestResponse,
    getInternalServerResponse,
    getLanguageCodes,
    getOkResponse,
    getQueryStrings,
    getResponse,
    getSignedUrls,
    HttpStatusCodes,
    parseTextResponse,
    s3Execute,
    TextDetectionResponseList,
    visionExecute,
} from '../src/get-language'
import { S3 } from 'aws-sdk'
import vision from '@google-cloud/vision'

describe('language code is parsed correctly', () => {
    const responses: TextDetectionResponseList = [
        [{}],
        [
            {
                fullTextAnnotation: {
                    pages: [
                        {
                            property: {
                                detectedLanguages: [{ languageCode: 'en' }],
                            },
                        },
                    ],
                },
            },
        ],
        [
            {
                fullTextAnnotation: {
                    pages: [
                        {
                            property: {
                                detectedLanguages: [{ languageCode: 'und' }],
                            },
                        },
                    ],
                },
            },
        ],
        [
            {
                fullTextAnnotation: {
                    pages: [
                        {
                            property: {
                                detectedLanguages: [{ languageCode: null }],
                            },
                        },
                    ],
                },
            },
        ],
    ]
    test('empty input returns null', () => {
        expect(parseTextResponse(responses[0])).toBeNull()
    })

    test(`response with non 'und' code returns string`, () => {
        expect(parseTextResponse(responses[1])).toEqual(
            responses[1][0].fullTextAnnotation.pages[0].property
                .detectedLanguages[0].languageCode
        )
    })

    test(`response with 'und' code returns null`, () => {
        expect(parseTextResponse(responses[2])).toBeNull()
    })

    test(`response with null language returns null`, () => {
        expect(parseTextResponse(responses[3])).toBeNull()
    })
})

describe('query string is pulled from event correctly', () => {
    const expected = { keys: ['a', 'b'] }
    test('empty multiValueQueryStringParameters returns undefined', () => {
        expect(
            getQueryStrings({ multiValueQueryStringParameters: null })
        ).toBeUndefined()
    })

    test('full multiValueQueryStringParameters returns object', () => {
        expect(
            getQueryStrings({
                multiValueQueryStringParameters: { ...expected },
            })
        ).toEqual(expect.objectContaining(expected))
    })
})

describe('media keys map to urls ', () => {
    const mockExecute = jest.fn((key) => Promise.resolve(`https://${key}`))
    const keys = ['1', '2']

    beforeEach(() => {
        mockExecute.mockClear()
        getSignedUrls(mockExecute, ...keys)
    })

    test('execute was called one time for each key', () => {
        expect(mockExecute).toHaveBeenCalledTimes(keys.length)
    })
})

describe('converter correctly formats response', () => {
    const headers = { 'Access-Control-Allow-Origin': '*' }
    test('empty body defaults to {}', () => {
        expect(getApiGatewayResponse(200)()).toMatchObject({
            statusCode: 200,
            body: JSON.stringify({}),
            headers,
        })
    })

    test('body gets stringified', () => {
        expect(getApiGatewayResponse(200)({ sample: 'hi' })).toEqual(
            expect.objectContaining({ body: JSON.stringify({ sample: 'hi' }) })
        )
    })

    test('wrapper responses map to api gateway responses', () => {
        expect(getOkResponse()()).toEqual(
            getApiGatewayResponse(HttpStatusCodes.OK)()
        )

        expect(getBadRequestResponse()).toEqual(
            getApiGatewayResponse(HttpStatusCodes.BAD_REQUEST)()
        )
        expect(getInternalServerResponse()()).toEqual(
            getApiGatewayResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR)()
        )
    })
})

describe('language codes are retrieved correct', () => {
    const visionMockExecute = jest.fn()
    const urls = ['url1', 'url2']

    beforeEach(() => {
        visionMockExecute.mockClear()
    })

    test('execute is called once per url', async () => {
        expect.assertions(1)
        await getLanguageCodes(visionMockExecute, ...urls)
        expect(visionMockExecute).toHaveBeenCalledTimes(urls.length)
    })

    test('error is thrown on failure', async () => {
        expect.assertions(1)
        const error = new Error()
        visionMockExecute.mockImplementation((url) => {
            return Promise.reject(error)
        })

        expect(
            getLanguageCodes(visionMockExecute, ...urls)
        ).rejects.toThrowError(error)
    })
})

describe('s3 execute pulls presigned url', () => {
    const mockClient = new S3()
    mockClient.getSignedUrlPromise = jest.fn()
    test('call is made to s3', () => {
        s3Execute('a', mockClient)

        expect(mockClient.getSignedUrlPromise).toHaveBeenCalledTimes(1)
    })
})

describe('vision execute retreives language', () => {
    const mockClient = new vision.ImageAnnotatorClient()
    mockClient.textDetection = jest.fn()

    test('call is made to google vision api', () => {
        visionExecute('a', mockClient)
        expect(mockClient.textDetection).toHaveBeenCalledTimes(1)
    })
})

describe('get response returns appropriate http response', () => {
    test('empty query strings returns bad request response', async () => {
        expect.assertions(1)
        expect(getResponse()).resolves.toBe(getBadRequestResponse)
    })
})
