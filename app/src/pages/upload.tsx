import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { PageContainerStyle } from "./index";
import "../styles/index.css";

const ImageCardImageStyle = (src: string) => ({
  backgroundImage: `url(${src})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});

const ImageCardPaperStyle = {
  height: "25vh",
  width: "25vw",
};

type ImageCardProps = {
  src: string;
};

const ImageCard = ({ src }: ImageCardProps) => (
  <Paper elevation={12} variant="outlined" style={ImageCardPaperStyle}>
    <Box style={ImageCardImageStyle(src)} height={9 / 10} />
    <Box height={1 / 10}>
      <TextField placeholder="Enter a hint..." />
    </Box>
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
    <Grid
      container
      style={PageContainerStyle}
      alignItems="center"
      justify="center"
    >
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
    </Grid>
  );
};
export default UploadPage;
