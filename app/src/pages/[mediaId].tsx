import React, { useState, useEffect } from 'react'
import { AsyncStatuses, ImageCardMedia } from './upload'
import Amplify, { API, Storage, graphqlOperation } from 'aws-amplify'
import { GraphQLResult } from '../../node_modules/@aws-amplify/api-graphql/lib-esm/types'
import * as queries from '../graphql/queries'
import { CircularProgress, Grid, Paper } from '@material-ui/core'
import config from '../aws-exports'
import { PageContainer } from '.'

Amplify.configure({ ...config })

const getMediaById = async (id: string): Promise<ImageCardMedia> => {
    try {
        const media = await (API.graphql(
            graphqlOperation(queries.getMedia, { id })
        ) as Promise<GraphQLResult<{ getMedia: Omit<ImageCardMedia, 'url'> }>>)

        if (media.errors) {
            throw new Error(media.errors.toString())
        }

        const url = (await Storage.get(
            media.data.getMedia.media.key.split('/').pop()
        )) as string

        return { ...media.data.getMedia, url }
    } catch (error) {
        throw new Error()
    }
}

export type ImagePageProps = { mediaId: string };
const ImagePage = ({ mediaId }: ImagePageProps): JSX.Element => {
    const [media, setMedia] = useState<ImageCardMedia>()

    useEffect(() => {
        getMediaById(mediaId).then((data) => setMedia(data))
    }, [])

    return (
        <PageContainer>
            <Grid item>
                {media ? (
                    <Paper elevation={12}>
                        <img
                            src={media.url}
                            height={500}
                            width={500}
                            style={{ padding: 12 }}
                        />
                    </Paper>
                ) : (
                    <CircularProgress />
                )}
            </Grid>
        </PageContainer>
    )
}

export default ImagePage
