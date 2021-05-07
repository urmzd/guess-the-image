import React, { useState } from "react";
import { Storage } from "aws-amplify";
import { navigate } from "gatsby";
import { Divider, Grid, IconButton } from "@material-ui/core";
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

type IndexPageSubContainerWrapperProps = {
  children: JSX.Element;
  hovering: boolean;
  setHovering: (hovering: boolean) => void;
  onClick: () => void;
};

type CustomIconButtonProps = Pick<
  IndexPageSubContainerWrapperProps,
  "children" | "hovering"
>;

const IndexPageGridContainerStyles = {
  minHeight: "100vh",
};

const CustomIconButtonStyles = (hovering?: boolean) => ({
  color: hovering ? Colours.White : Colours.Black,
  fontSize: "3rem",
  transition: "all ease-in-out 750ms",
});

const SubContainerStyles = (hovering?: boolean) => ({
  height: `${hovering === undefined ? 50 : hovering ? 80 : 20}vh`,
  background: hovering ? Colours.ShopifyGreen : Colours.Transparent,
  transition: "all ease-in-out 750ms",
});

const CustomIconButton = ({ children, hovering }: CustomIconButtonProps) => (
  <IconButton style={CustomIconButtonStyles(hovering)}>{children}</IconButton>
);

const IndexPageSubContainerWrapper = ({
  hovering,
  setHovering,
  children,
}: IndexPageSubContainerWrapperProps) => (
  <Grid
    container
    item
    alignItems="center"
    justify="center"
    style={SubContainerStyles(hovering)}
    onMouseLeave={() => setHovering(false)}
    onMouseEnter={() => setHovering(true)}
  >
    <CustomIconButton hovering={hovering}>{children}</CustomIconButton>
  </Grid>
);

export enum PageLocations {
  PLAY = "/play",
  UPLOAD = "/upload",
}

export type SubContainerList = ((
  | IndexPageSubContainerWrapperProps
  | { divider: true }
) & { key: `d${number}` | PageLocations })[];

const IndexPage = () => {
  const [hoveringPlayContainer, setHoveringPlayContainer] = useState<boolean>();
  const [
    hoveringUploadContainer,
    setHoveringUploadContainer,
  ] = useState<boolean>();

  const containers: SubContainerList = [
    {
      key: PageLocations.PLAY,
      hovering: hoveringPlayContainer,
      setHovering: setHoveringPlayContainer,
      children: <PlayCircleFilled fontSize="inherit" />,
      onClick: async () => await navigate(PageLocations.PLAY),
    },
    {
      key: "d1",
      divider: true,
    },
    {
      key: PageLocations.UPLOAD,
      hovering: hoveringUploadContainer,
      setHovering: setHoveringUploadContainer,
      children: <CloudUpload fontSize="inherit" />,
      onClick: async () => await navigate(PageLocations.UPLOAD),
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
        .map(({ key, ...container }) =>
          "divider" in container ? (
            <Divider />
          ) : (
            <IndexPageSubContainerWrapper {...container} />
          )
        )
        .map((element) => (
          <Grid item>{element}</Grid>
        ))}
    </Grid>
  );
};

export default IndexPage;
