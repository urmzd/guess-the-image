import {ImageAnnotatorClient} from '@google-cloud/vision';
import {APIGatewayProxyHandler} from 'aws-lambda';
import {S3} from 'aws-sdk';
import {GetLanguageQueryParameters, LanguageCodeOrNullList} from 'types';

const s3 = new S3();

const imageAnnotatorClient = new ImageAnnotatorClient();

export enum HttpStatusCodes {
  OK = 200,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
}

export const getApiGatewayResponse = (
    statusCode: HttpStatusCodes,
    args?: { [key: string]: any },
) => ({
  statusCode,
  body: JSON.stringify(args ?? {}),
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.multiValueQueryStringParameters) {
    return getApiGatewayResponse(HttpStatusCodes.BAD_REQUEST);
  }
  const {
    keys,
  } = event.multiValueQueryStringParameters as GetLanguageQueryParameters;

  try {
    const s3UrlsRequest = keys?.map((key) =>
      s3.getSignedUrlPromise('getObject', {
        Key: key,
        Bucket: process.env.BUCKET,
      }),
    );
    const s3UrlsResponse = await Promise.all(s3UrlsRequest);

    const languageCodesRequest = s3UrlsResponse?.map((url) =>
      imageAnnotatorClient.textDetection(url),
    );

    const languageCodesResponse = await Promise.all(languageCodesRequest);

    const languageCodes: LanguageCodeOrNullList = languageCodesResponse
        .map(
            (code) =>
              code?.[0]?.fullTextAnnotation?.pages?.[0]?.property
                  ?.detectedLanguages?.[0]?.languageCode,
        )
        .map((code) => (!code || code === 'und' ? null : code));

    return getApiGatewayResponse(HttpStatusCodes.OK, {languageCodes});
  } catch (error) {
    return getApiGatewayResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};
