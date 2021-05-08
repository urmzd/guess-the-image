import React, { useRef, useEffect, useState, ChangeEvent } from "react";
import { Grid, Paper, TextField, Fade, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { PageContainer, PageLocations } from "./index";
import "../styles/index.css";
import { navigate } from "gatsby";
import config from "../aws-exports";
import Amplify, { Storage } from "aws-amplify";
import { nanoid } from "nanoid";

Amplify.configure({ ...config });
Storage.configure({ ...config });

const ImageCardImageStyle = (src: string) => ({
  backgroundImage: `url(${src})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  aspectRatio: "16/9",
  height: 400,
});

type ImageCardProps = {
  src: string | string[];
  index?: number;
  onBack?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
};

const ImageCard = ({ src }: ImageCardProps) => (
  <Paper elevation={12} variant="outlined">
    <Grid container>
      <Grid item xs={12}>
        <Fade in={false}>
          <Alert severity="error">Picture does not have text</Alert>
        </Fade>
      </Grid>
      <Grid item xs={12} style={ImageCardImageStyle(src as string)} />
      <Grid container item xs={12} style={{ padding: 12 }} spacing={3}>
        <Grid item xs={12}>
          <TextField placeholder="Enter a hint..." fullWidth variant="filled" />
        </Grid>
        <Grid item container xs={12} spacing={2}>
          <Grid item>
            <Button>BACK</Button>
          </Grid>
          <Grid item>
            <Button variant="contained">NEXT</Button>
          </Grid>
          <Grid item>
            <Button variant="contained">COMPLETE</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Paper>
);

export enum ImageContentTypes {
  JPEG = "image/jpeg",
  PNG = "image/png",
  JPG = "image/jpg",
}

export type ImageKey = `${string}.${string}`;

const getImageKey = (extension: ImageContentTypes): ImageKey =>
  `${nanoid()}.${extension.split("/").pop()}` as const;

const UploadPage = () => {
  const inputRef = useRef(null);
  const [urls, setUrls] = useState<Object[]>();

  useEffect(() => {
    if (inputRef) {
      (inputRef.current as HTMLElement).click();
    }
  }, []);

  const uploadHandler = async ({
    target: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    const filesArray = Array.from(files);
    const fileUrlPromises = filesArray.map((file) =>
      Storage.put(getImageKey(file.type as ImageContentTypes), file)
    );

    try {
      setUrls(await Promise.all(fileUrlPromises));
    } catch (error) {
      console.log(error);
    }
  };

  console.log(urls);
  return (
    <PageContainer>
      <>
        {/*
         *{files?.map((file) => (
         *  <Grid item key={file.name}>
         *    <ImageCard src={URL.createObjectURL(file)} />
         *  </Grid>
         *))}
         */}
        <Grid item>
          <input
            type="file"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={uploadHandler}
            multiple
            accept={Object.values(ImageContentTypes).join(",")}
          />
        </Grid>
      </>
    </PageContainer>
  );
};
export default UploadPage;
