export const schema = {
    models: {
        Media: {
            name: 'Media',
            fields: {
                id: {
                    name: 'id',
                    isArray: false,
                    type: 'ID',
                    isRequired: true,
                    attributes: [],
                },
                hint: {
                    name: 'hint',
                    isArray: false,
                    type: 'String',
                    isRequired: true,
                    attributes: [],
                },
                language: {
                    name: 'language',
                    isArray: false,
                    type: 'String',
                    isRequired: true,
                    attributes: [],
                },
                media: {
                    name: 'media',
                    isArray: false,
                    type: {
                        nonModel: 'S3Object',
                    },
                    isRequired: true,
                    attributes: [],
                },
            },
            syncable: true,
            pluralName: 'Media',
            attributes: [
                {
                    type: 'model',
                    properties: {},
                },
            ],
        },
    },
    enums: {},
    nonModels: {
        S3Object: {
            name: 'S3Object',
            fields: {
                key: {
                    name: 'key',
                    isArray: false,
                    type: 'String',
                    isRequired: true,
                    attributes: [],
                },
                bucket: {
                    name: 'bucket',
                    isArray: false,
                    type: 'String',
                    isRequired: true,
                    attributes: [],
                },
                region: {
                    name: 'region',
                    isArray: false,
                    type: 'String',
                    isRequired: true,
                    attributes: [],
                },
            },
        },
    },
    version: '0283253e78e843b67bcce07e828fb39d',
}
