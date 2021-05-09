import { GetLanguageResponse, KeyList } from 'types'

export const getLanguageCode = async (...keys: KeyList) => {
    const queryParameters = new URLSearchParams(keys.map((key) => ['keys', key]))
    try {
        const response = await fetch(
            `${process.env.GATSBY_API_ENDPOINT}${
                process.env.GATSBY_API_LANGUAGE_ENDPOINT
            }?${queryParameters.toString()}`,
            { headers: { 'x-api-key': process.env.GATSBY_API_KEY } }
        )

        const { languageCodes }: GetLanguageResponse = await response.json()

        return languageCodes
    } catch (error) {
        throw new Error(error)
    }
}
