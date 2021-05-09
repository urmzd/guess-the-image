import React, {useReducer} from 'react'
import {navigate} from 'gatsby'
import {Grid} from '@material-ui/core'
import {CloudUpload, PlayCircleFilled} from '@material-ui/icons'
import '../styles/index.css'
import {PageLocations} from '../common'
import {PageContainer, SubContainerList, SubContainerWrapper} from '../components'

export enum UIEventStates {
  DEFAULT = 50,
  HOVERING = 80,
  CLICKED = 100,
}

export type SubContainerState = {
  subContainers: number[];
};
export type SubContainerAction = {
  type: SubContainerActionTypes;
  payload: {
    subContainerIndex: number;
    subContainerEventState: UIEventStates;
  };
};
const subContainerInitialState: SubContainerState = {
    subContainers: [UIEventStates.HOVERING, 100 - UIEventStates.HOVERING],
}

enum SubContainerActionTypes {
  INCREMENT = 'increment',
}

const subContainerIncrement = (
    index: number,
    eventState: UIEventStates
): SubContainerAction => ({
    type: SubContainerActionTypes.INCREMENT,
    payload: {
        subContainerIndex: index,
        subContainerEventState: eventState,
    },
})

const subContainerReducer = (
    state: SubContainerState,
    {
        type,
        payload: { subContainerIndex, subContainerEventState },
    }: SubContainerAction
) => {
    if (type === SubContainerActionTypes.INCREMENT) {
        return {
            subContainers: state.subContainers.map((_, index) =>
                index === subContainerIndex
                    ? subContainerEventState
                    : UIEventStates.CLICKED - (subContainerEventState / (state.subContainers.length - 1))
            ),
        }
    }

    return state
}

const IndexPage = (): JSX.Element => {
    const [state, dispatch] = useReducer(
        subContainerReducer,
        subContainerInitialState
    )

    const containers: SubContainerList = [
        {
            index: 0,
            eventState: state.subContainers[0],
            setEventState: (eventState) =>
                dispatch(subContainerIncrement(0, eventState)),
            children: <PlayCircleFilled fontSize="inherit" />,
            label: PageLocations.PLAY,
            goTo: () => navigate(PageLocations.PLAY),
        },
        {
            index: 1,
            eventState: state.subContainers[1],
            setEventState: (eventState) =>
                dispatch(subContainerIncrement(1, eventState)),
            children: <CloudUpload fontSize="inherit" />,
            label: PageLocations.UPLOAD,
            goTo: () => navigate(PageLocations.UPLOAD),
        },
    ]

    return (
        <PageContainer
            props={{
                justify: 'space-evenly',
                direction: 'column',
                alignItems: 'stretch',
            }}
        >
            <>
                {containers
                    .map(({ index, ...container }) => ({
                        index,
                        children: <SubContainerWrapper {...container} index={index} />,
                    }))
                    .map(({ index, children }) => (
                        <Grid item key={index}>
                            {children}
                        </Grid>
                    ))}
            </>
        </PageContainer>
    )
}

export default IndexPage
