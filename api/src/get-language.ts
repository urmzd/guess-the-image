import { ImageAnnotatorClient } from "@google-cloud/vision";
import { APIGatewayProxyHandler } from "aws-lambda";

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
  body: args ? JSON.stringify(args) : "",
});

export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.queryStringParameters) {
    const { uri } = event.queryStringParameters;

    try {
      const { languageCode } = (
        await imageAnnotatorClient.textDetection(uri)
      )?.[0]?.fullTextAnnotation?.pages?.[0]?.property?.detectedLanguages?.[0];

      return getApiGatewayResponse(HttpStatusCodes.OK, { languageCode });
    } catch (error) {
      return getApiGatewayResponse(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }

  return getApiGatewayResponse(HttpStatusCodes.BAD_REQUEST);
};
