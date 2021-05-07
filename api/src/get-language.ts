import { ImageAnnotatorClient } from "@google-cloud/vision";
import { APIGatewayProxyHandler } from "aws-lambda";
import { GetLanguageQueryParameters, LanguageCodeOrNull } from "types";

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
  body: args ? JSON.stringify(args) : "{}",
});

export const handler: APIGatewayProxyHandler = async (event) => {
  const {
    uris,
  } = event.multiValueQueryStringParameters as GetLanguageQueryParameters;

  if (!uris) {
    return getApiGatewayResponse(HttpStatusCodes.BAD_REQUEST);
  }

  try {
    const languageCodePromises = uris?.map((uri) =>
      imageAnnotatorClient.textDetection(uri)
    );

    const languageCodes: LanguageCodeOrNull[] = (
      await Promise.all(languageCodePromises)
    )
      .map(
        (code) =>
          code?.[0]?.fullTextAnnotation?.pages?.[0]?.property
            ?.detectedLanguages?.[0]?.languageCode
      )
      .map((code) => (code === "und" ? null : code));

    return getApiGatewayResponse(HttpStatusCodes.OK, { languageCodes });
  } catch (error) {
    return getApiGatewayResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};
