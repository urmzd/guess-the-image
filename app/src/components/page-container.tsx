import { Grid, GridProps } from '@material-ui/core'
import React from 'react'

export const PageContainerStyle = {
    minHeight: '100vh',
    minWidth: '100vw',
}
export type PageContainerProps = {
  children: JSX.Element;
  props?: GridProps;
};
export const PageContainer = ({
    props = {},
    children,
}: PageContainerProps): JSX.Element => (
    <Grid
        container
        style={PageContainerStyle}
        alignItems="center"
        justify="center"
        {...props}
    >
        {children}
    </Grid>
)
