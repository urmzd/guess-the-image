import React, { useState, useEffect } from 'react'
import { ImageCardMedia } from './upload'
import Amplify, { API, Storage, graphqlOperation } from 'aws-amplify'
import * as queries from '../graphql/queries'
import { navigate } from 'gatsby'
import { CircularProgress, Grid, Paper } from '@material-ui/core'
import config from '../aws-exports'
import { PageContainer } from '../components'
import { PageLocations, GraphQLResult } from '../common'

Amplify.configure({ ...config, ssr: true })

export type ImagePageProps = { mediaId: string };

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
        throw new Error(error)
    }
}

const ImagePage = ({ mediaId, ...rest }: ImagePageProps): JSX.Element => {
    console.log(rest)
    const [media, setMedia] = useState<ImageCardMedia>()

    useEffect(() => {
        if (mediaId) {
            getMediaById(mediaId)
                .then((data) => setMedia(data))
                .catch((err) => {
                    console.log(err)
                    navigate(PageLocations.NOT_FOUND)
                })
        }
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
