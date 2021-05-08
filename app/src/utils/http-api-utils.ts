import { GetLanguageResponse, UriList } from "types";
export const getLanguageCode = async (...uris: UriList) => {
  const queryParameters = new URLSearchParams(uris.map((uri) => ["uris", uri]));
  try {
    const response = await fetch(
      `${process.env.GATSBY_API_ENDPOINT}${
        process.env.GATSBY_API_LANGUAGE_ENDPOINT
      }?${queryParameters.toString()}`,
      { headers: { "x-api-key": process.env.GATSBY_API_KEY } }
    );

    const { languageCodes }: GetLanguageResponse = await response.json();

    return languageCodes;
  } catch (error) {
    throw new Error(error);
  }
};
