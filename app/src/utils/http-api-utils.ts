export const getLanguageCode = async (uri: string) => {
  const queryParameters = new URLSearchParams({ uri });
  try {
    const response = await fetch(
      `${process.env.GATSBY_API_ENDPOINT}${
        process.env.GATSBY_API_LANGUAGE_ENDPOINT
      }${queryParameters.toString()}`,
      { headers: { "x-api-key": process.env.API_KEY } }
    );

    const { languageCode }: { languageCode: string } = await response.json();

    if (languageCode !== "und") {
      return languageCode;
    }

    return undefined;
  } catch {
    return undefined;
  }
};
