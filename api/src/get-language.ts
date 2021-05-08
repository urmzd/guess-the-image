import { ImageAnnotatorClient } from "@google-cloud/vision";
import { APIGatewayProxyHandler } from "aws-lambda";
import { GetLanguageQueryParameters, LanguageCodeOrNullList } from "types";

const imageAnnotatorClient = new ImageAnnotatorClient();

export enum HttpStatusCodes {
  OK = 200,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
}

export const getApiGatewayResponse = (
  statusCode: HttpStatusCodes,
  args?: { [key: string]: any }
) => ({
  statusCode,
  body: JSON.stringify(args ?? {}),
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

export const handler: APIGatewayProxyHandler = async (event) => {
  const {
    uris,
  } = event.multiValueQueryStringParameters as GetLanguageQueryParameters;

  if (!uris) {
    return getApiGatewayResponse(HttpStatusCodes.BAD_REQUEST);
  }

  try {
    const languageCodesRequest = uris?.map((uri) =>
      imageAnnotatorClient.textDetection(uri)
    );

    const languageCodesResponse = await Promise.all(languageCodesRequest);

    const languageCodes: LanguageCodeOrNullList = languageCodesResponse
      .map(
        (code) =>
          code?.[0]?.fullTextAnnotation?.pages?.[0]?.property
            ?.detectedLanguages?.[0]?.languageCode
      )
      .map((code) => (!code || code === "und" ? null : code));

    return getApiGatewayResponse(HttpStatusCodes.OK, { languageCodes });
  } catch (error) {
    return getApiGatewayResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};
