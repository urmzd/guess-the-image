import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { PageContainer } from "./index";
import "../styles/index.css";
import { ArrowBack } from "@material-ui/icons";

const ImageCardImageStyle = (src: string) => ({
  backgroundImage: `url(${src})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  aspectRatio: "16/9",
  height: 400,
});

const ImageCardPaperStyle = {
  transition: "all ease-in-out 1s",
};

type ImageCardProps = {
  src: string;
};

const ImageCard = ({ src }: ImageCardProps) => (
  <Paper elevation={12} variant="outlined" style={ImageCardPaperStyle}>
    <Grid container>
      <Grid item xs={12}>
        <Alert severity="error">Picture does not have text</Alert>
      </Grid>
      <Grid item xs={12} style={ImageCardImageStyle(src)} />
      <Grid item xs={12}>
        <TextField placeholder="Enter a hint..." fullWidth variant="filled" />
      </Grid>
      <Grid
        item
        container
        xs={12}
        justify="space-between"
        style={{ padding: 12 }}
      >
        <Grid item xs={4}>
          <Button variant="contained">BACK</Button>
        </Grid>
        <Grid container xs={8} item justify="flex-end" spacing={4}>
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

const UploadPage = () => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState<File[]>();

  useEffect(() => {
    if (inputRef) {
      (inputRef.current as HTMLElement).click();
    }
  }, []);

  return (
    <PageContainer>
      <>
        {files?.map((file) => (
          <Grid item key={file.name}>
            <ImageCard src={URL.createObjectURL(file)} />
          </Grid>
        ))}
        <Grid item>
          <input
            type="file"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={(event) => setFiles(Array.from(event.target.files))}
            multiple
            accept=".jpeg, .png, .jpg"
          />
        </Grid>
      </>
    </PageContainer>
  );
};
export default UploadPage;
