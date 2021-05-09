import React from 'react'
import { Colours, StyleTransitions } from '../styles/constants'
import { SubContainerWrapperProps } from './sub-container'
import { UIEventStates } from '../pages'
import { Fade, IconButton } from '@material-ui/core'

export type CustomIconButtonProps = Pick<
  SubContainerWrapperProps,
  'children' | 'eventState'
>;

export const CustomIconButtonStyles = (eventState?: UIEventStates) => ({
    color: eventState > UIEventStates.DEFAULT ? Colours.WHITE : Colours.BLACK,
    fontSize: '3rem',
    transition: StyleTransitions.DEFAULT,
})
export const CustomIconButton = ({
    children,
    eventState,
}: CustomIconButtonProps) => (
    <Fade in={!!eventState}>
        <IconButton style={CustomIconButtonStyles(eventState)}>
            {children}
        </IconButton>
    </Fade>
)
