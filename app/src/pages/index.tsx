import React, { useReducer } from "react";
import { Storage } from "aws-amplify";
import { navigate } from "gatsby";
import { Typography, Grid, IconButton } from "@material-ui/core";
import { CloudUpload, PlayCircleFilled } from "@material-ui/icons";
import config from "../aws-exports";
import "../styles/index.css";

Storage.configure({ ...config });

enum Colours {
  Transparent = "transparent",
  ShopifyGreen = "#96bf48",
  White = "#fff",
  Black = "#000",
}

export enum UIEventStates {
  DEFAULT = 50,
  HOVERING = 80,
  CLICKED = 100,
}

type IndexPageSubContainerWrapperProps = {
  children: JSX.Element;
  label: PageLocations;
  index: SubContainerIndex;
  eventState: UIEventStates;
  goTo: () => void;
  setEventState: (eventState: UIEventStates) => void;
};

type CustomIconButtonProps = Pick<
  IndexPageSubContainerWrapperProps,
  "children" | "eventState"
>;

const IndexPageGridContainerStyles = {
  minHeight: "100vh",
};

const CustomIconButtonStyles = (eventState?: UIEventStates) => ({
  color: eventState > UIEventStates.DEFAULT ? Colours.White : Colours.Black,
  fontSize: "3rem",
  transition: StyleTransitions.DEFAULT,
});

enum StyleTransitions {
  DEFAULT = "all ease-in-out 750ms",
}

const SubContainerStyles = (eventState: UIEventStates) => ({
  height: `${eventState}vh`,
  background:
    eventState > UIEventStates.DEFAULT
      ? Colours.ShopifyGreen
      : Colours.Transparent,
  opacity: `${eventState > 0 ? 1 : 0}`,
  transition: StyleTransitions.DEFAULT,
});

const CustomIconButton = ({ children, eventState }: CustomIconButtonProps) => (
  <IconButton style={CustomIconButtonStyles(eventState)}>{children}</IconButton>
);
const IndexPageSubContainerLabelStyles = (show?: boolean) => ({
  opacity: +show,
  transition: StyleTransitions.DEFAULT,
  color: Colours.White,
});

const IndexPageSubContainerWrapper = ({
  eventState,
  setEventState,
  children,
  label,
  goTo,
}: IndexPageSubContainerWrapperProps) => {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      alignContent="center"
      style={SubContainerStyles(eventState)}
      onMouseEnter={() => setEventState(UIEventStates.HOVERING)}
      onClick={() =>
        eventState === UIEventStates.CLICKED
          ? goTo()
          : setEventState(UIEventStates.CLICKED)
      }
    >
      <CustomIconButton eventState={eventState}>{children}</CustomIconButton>
      <Grid
        item
        style={IndexPageSubContainerLabelStyles(
          eventState === UIEventStates.CLICKED
        )}
      >
        <Typography>{`PRESS TO ${label
          .replace("/", "")
          .toUpperCase()}`}</Typography>
      </Grid>
    </Grid>
  );
};

export enum PageLocations {
  PLAY = "/play",
  UPLOAD = "/upload",
}

export type SubContainerList = IndexPageSubContainerWrapperProps[];

export type SubContainerState = {
  subContainers: [number, number];
};

export enum SubContainerActionTypes {
  INCREMENT = "increment",
}

export type SubContainerAction = {
  type: SubContainerActionTypes;
  payload: {
    subContainerIndex: SubContainerIndex;
    subContainerEventState: UIEventStates;
  };
};

const subContainerInitialState: SubContainerState = {
  subContainers: [UIEventStates.DEFAULT, UIEventStates.DEFAULT],
};

type SubContainerIndex = 0 | 1;

const subContainerIncrement = (
  index: SubContainerIndex,
  eventState: UIEventStates
): SubContainerAction => ({
  type: SubContainerActionTypes.INCREMENT,
  payload: {
    subContainerIndex: index,
    subContainerEventState: eventState,
  },
});

const subContainerReducer = (
  state: SubContainerState,
  {
    type,
    payload: { subContainerIndex, subContainerEventState },
  }: SubContainerAction
) => {
  if (type === SubContainerActionTypes.INCREMENT) {
    return {
      subContainers: state.subContainers.map((container, index) =>
        index === subContainerIndex
          ? subContainerEventState
          : UIEventStates.CLICKED - subContainerEventState
      ),
    };
  }

  return state;
};

const IndexPage = () => {
  const [state, dispatch] = useReducer(
    subContainerReducer,
    subContainerInitialState
  );

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
  ];

  return (
    <Grid
      container
      direction="column"
      style={IndexPageGridContainerStyles}
      justify="space-evenly"
    >
      {containers
        .map(({ index, ...container }) => ({
          index,
          children: (
            <IndexPageSubContainerWrapper {...container} index={index} />
          ),
        }))
        .map(({ index, children }) => (
          <Grid item key={index}>
            {children}
          </Grid>
        ))}
    </Grid>
  );
};

export default IndexPage;
