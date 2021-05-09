import {
    getQueryStrings,
    parseTextResponse,
    TextDetectionResponseList,
} from '../src/get-language'

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
