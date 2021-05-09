import { Button, Fade, Grid, Paper, TextField } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React from 'react'
import { HintChangeFunction, ImageCardMediaList } from '../pages/upload'
import { StyleTransitions } from '../styles/constants'

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
type ImageCardProps = {
  mediaList: ImageCardMediaList;
  index: number;
  onHintChange: HintChangeFunction;
  onBack: () => void;
  onNext: () => void;
  onComplete?: () => void;
};
export const ImageCard = ({
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
                                'Since picture does not have text, it will not be displayed in game.'
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
