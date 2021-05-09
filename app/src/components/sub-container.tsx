import {Colours, StyleTransitions} from '../styles/constants'
import {CircularProgress, Fade, Grid, Typography} from '@material-ui/core'
import React from 'react'
import {PageLocations} from '../common'
import {CustomIconButton} from './custom-icon'
import {UIEventStates} from '../pages'

export type SubContainerList = SubContainerWrapperProps[];
export type SubContainerWrapperProps = {
  children: JSX.Element;
  label: PageLocations;
  index: number;
  eventState: UIEventStates;
  goTo: () => void;
  setEventState: (eventState: UIEventStates) => void;
};
export const SubContainerLabelStyles = {
    transition: StyleTransitions.DEFAULT,
    color: Colours.WHITE,
}

export const SubContainerStyles = (eventState: UIEventStates) => ({
    height: `${eventState}vh`,
    background:
    eventState > UIEventStates.DEFAULT
        ? Colours.SHOPIFY_GREEN
        : Colours.TRANSPARENT,
    opacity: `${eventState > 0 ? 1 : 0}`,
    transition: StyleTransitions.DEFAULT,
})
export const SubContainerWrapper = ({
    eventState,
    setEventState,
    children,
    label,
    goTo,
}: SubContainerWrapperProps) => (
    <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        alignContent="center"
        style={SubContainerStyles(eventState)}
        onMouseEnter={() => setEventState(UIEventStates.HOVERING)}
        onTransitionEnd={() => eventState === UIEventStates.CLICKED && goTo()}
        onClick={() => setEventState(UIEventStates.CLICKED)}
    >
        <Fade in={eventState === UIEventStates.CLICKED}>
            <>
                <CustomIconButton eventState={eventState}>
                    {eventState === UIEventStates.CLICKED ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        children
                    )}
                </CustomIconButton>
                <Grid item style={SubContainerLabelStyles}>
                    <Typography>
                        {eventState !== UIEventStates.CLICKED
                            ? `PRESS TO ${label.replace('/', '').toUpperCase()}`
                            : 'Loading...'}
                    </Typography>
                </Grid>
            </>
        </Fade>
    </Grid>
)
