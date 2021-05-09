// @ts-check
import { initSchema } from '@aws-amplify/datastore'
import { schema } from './schema'

const { Media, S3Object } = initSchema(schema)

export { Media, S3Object }
