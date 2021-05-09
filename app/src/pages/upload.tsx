import React, { useRef, useEffect, useState, ChangeEvent } from 'react'
import {
    Grid,
    Paper,
    TextField,
    Fade,
    Button,
    CircularProgress,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { PageContainer, PageLocations, StyleTransitions } from './index'
import { navigate } from 'gatsby'
import config from '../aws-exports'
import Amplify, { Storage, API, graphqlOperation } from 'aws-amplify'
import { GraphQLResult } from '../../node_modules/@aws-amplify/api-graphql/lib-esm/types'
import { nanoid } from 'nanoid'
import { getLanguageCode } from '../utils/http-api-utils'
import { LanguageCodeOrNull } from 'types'
import * as mutations from '../graphql/mutations'
import '../styles/index.css'

Amplify.configure({ ...config })

const imageCardStyle = {
    width: 500,
    transition: StyleTransitions.DEFAULT,
}

const imageCardImageStyle = (src: string) => ({
    overflow: 'auto',
    backgroundImage: `url(${src})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: 500,
    height: 500,
    transition: StyleTransitions.DEFAULT,
})

export type HintChangeFunction = (index: number, hint: string) => void;

type ImageCardProps = {
  mediaList: ImageCardMediaList;
  index: number;
  onHintChange: HintChangeFunction;
  onBack: () => void;
  onNext: () => void;
  onComplete?: () => void;
};

const ImageCard = ({
    mediaList,
    index,
    onBack,
    onNext,
    onComplete,
    onHintChange,
}: ImageCardProps) => (
    <Paper elevation={12} variant="outlined" style={imageCardStyle}>
        <Grid container>
            {!mediaList[index].languageCode && (
                <Grid item xs={12}>
                    <Fade in={!mediaList[index].languageCode}>
                        <Alert severity="warning">
                            {
                                'Since picture does not have picture. It will not be displayed in game.'
                            }
                        </Alert>
                    </Fade>
                </Grid>
            )}
            <Grid item xs={12} style={imageCardImageStyle(mediaList[index].url)} />
            <Grid container item xs={12} style={{ padding: 12 }} spacing={3}>
                {mediaList[index].languageCode && (
                    <Grid item xs={12}>
                        <TextField
                            onChange={(event) => onHintChange(index, event.target.value)}
                            value={mediaList[index].hint ?? ''}
                            placeholder="Enter a hint..."
                            fullWidth
                        />
                    </Grid>
                )}
                <Grid item container xs={12} spacing={2}>
                    <Grid item>
                        <Button onClick={onBack} disabled={index === 0}>
                            {'BACK'}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            disabled={index === mediaList.length - 1}
                            onClick={onNext}
                        >
                            {'NEXT'}
                        </Button>
                    </Grid>
                    <Grid item onClick={onComplete}>
                        <Button variant="contained">COMPLETE</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Paper>
)

export enum ImageExtensions {
  JPEG = 'jpeg',
  PNG = 'png',
  JPG = 'jpg',
}

export type ImageContentTypes = `image/${ImageExtensions}`;

export enum ImagePrivacyTypes {
  PUBLIC = 'public',
}

export type ImageKey<
  RequestType extends boolean = boolean
> = RequestType extends true
  ? `${ImagePrivacyTypes}/${string}.${ImageExtensions}`
  : `${string}.${ImageExtensions}`;

export type StoragePutResponse = { key: ImageKey };

export type Media = {
  hint?: string;
  languageCode: LanguageCodeOrNull;
  media: { key: ImageKey };
};
export type ImageCardMedia = Media & { url: string; id: string };

export type ImageCardMediaList = ImageCardMedia[];

export enum AsyncStatuses {
  FULFILLED,
  REJECTED,
  IN_PROGRESS,
}

const getImageKey = (
    id: string,
    extension: ImageExtensions,
    prefix?: ImagePrivacyTypes
): ImageKey => {
    const hasPrefix = !!prefix
    const _prefix = prefix ? prefix + '/' : ''

    return `${_prefix}${id}.${extension}` as ImageKey<typeof hasPrefix>
}

type ImageMeta = {
  id: string;
  extension: ImageExtensions;
};

type ImageMetaList = ImageMeta[];
type FileList = File[];

const getFileExtension = (file: File): ImageExtensions =>
  file.type.split('/').pop() as ImageExtensions

const uploadImages = async (files: FileList) => {
    const imageMetas: ImageMetaList = Array(files.length)
        .fill(0)
        .map((_, index) => ({
            id: nanoid(),
            extension: getFileExtension(files[index]),
        }))

    const putFilePromises = imageMetas.map(({ id, extension }, index) =>
        Storage.put(getImageKey(id, extension), files[index])
    ) as Promise<StoragePutResponse>[]

    try {
        await Promise.all(putFilePromises)
        const imageKeys = imageMetas.map(({ id, extension }) =>
            getImageKey(id, extension, ImagePrivacyTypes.PUBLIC)
        )
        const languageCodes = await getLanguageCode(...imageKeys)

        const medias: ImageCardMediaList = languageCodes.map(
            (languageCode, index) => ({
                languageCode,
                media: {
                    key: imageKeys[index],
                },
                url: URL.createObjectURL(files[index]),
                id: imageMetas[index].id,
            })
        )

        return medias
    } catch (error) {
    // TODO: add different error states.
    // TODO: show different error messages based on error type.
        console.error(error)
        throw new Error(error)
    }
}
const storeImageMetaData = async (mediaList: ImageCardMediaList) => {
    const mutationQueries = mediaList.map(
        ({ id, languageCode, hint, media }) =>
      API.graphql(
          graphqlOperation(mutations.createMedia, {
              input: { id, languageCode, hint, media },
          })
      ) as Promise<GraphQLResult<Record<string, unknown>>>
    )

    try {
        const queryResponses = await Promise.all(mutationQueries)
        queryResponses.forEach(({ errors }) => {
            if (errors) {
                throw new Error(errors.toString())
            }
        })
    } catch (error) {
        throw new Error(error)
    }
}

const UploadPage = (): JSX.Element => {
    const inputRef = useRef(null)
    const [files, setFiles] = useState<FileList>()
    const [images, setImages] = useState<MediaList>()
    const [imageIndex, setImageIndex] = useState<number>(0)
    const [uploadStatus, setUploadStatus] = useState<AsyncStatuses>()
    const [storeDataStatus, setStoreDataStatus] = useState<AsyncStatuses>()

    const onHintChange: HintChangeFunction = (index: number, hint: string) => {
        setImages(
            images.map((image, imageIndex) =>
                index === imageIndex ? { ...image, hint } : { ...image }
            )
        )
    }

    useEffect(() => {
        if (storeDataStatus === AsyncStatuses.IN_PROGRESS) {
            storeImageMetaData(images)
                .then(() => {
                    setStoreDataStatus(AsyncStatuses.FULFILLED)
                })
                .catch(() => setStoreDataStatus(AsyncStatuses.REJECTED))
        }

        if (storeDataStatus === AsyncStatuses.FULFILLED) {
            navigate(PageLocations.PLAY)
        }
    })

    useEffect(() => {
        if (uploadStatus === AsyncStatuses.IN_PROGRESS) {
            uploadImages(files)
                .then((data) => {
                    setImages(data)
                    setUploadStatus(AsyncStatuses.FULFILLED)
                })
                .catch(() => setUploadStatus(AsyncStatuses.REJECTED))
        }
    }, [uploadStatus])

    useEffect(() => {
        if (inputRef) {
            triggerUpload()
        }
    }, [])

    const uploadHandler = async ({
        target: { files },
    }: ChangeEvent<HTMLInputElement>) => {
        const filesArray = Array.from(files)
        setFiles(filesArray)
        setUploadStatus(AsyncStatuses.IN_PROGRESS)
    }
    const goToNextImage = () =>
        setImageIndex(imageIndex < images.length - 1 ? imageIndex + 1 : imageIndex)
    const goToPreviousImage = () =>
        setImageIndex(imageIndex ? imageIndex - 1 : 0)
    const completeProcess = () => setStoreDataStatus(AsyncStatuses.IN_PROGRESS)

    const triggerUpload = () => inputRef.current.click()

    return (
        <PageContainer>
            <>
                {images ? (
                    <Grid item>
                        <Fade in={!images?.length}>
                            <ImageCard
                                index={imageIndex}
                                mediaList={images}
                                onNext={goToNextImage}
                                onBack={goToPreviousImage}
                                onHintChange={onHintChange}
                                onComplete={completeProcess}
                            />
                        </Fade>
                    </Grid>
                ) : (
                    <Grid
                        container
                        item
                        direction="column"
                        alignItems="center"
                        spacing={4}
                    >
                        <Grid item>
                            <CircularProgress />
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" onClick={triggerUpload}>
                                {'UPLOAD'}
                            </Button>
                        </Grid>
                    </Grid>
                )}
                <Grid item>
                    <input
                        type="file"
                        ref={inputRef}
                        style={{ display: 'none' }}
                        onChange={uploadHandler}
                        multiple
                        accept={Object.values(ImageExtensions).join(',')}
                    />
                </Grid>
            </>
        </PageContainer>
    )
}
export default UploadPage
