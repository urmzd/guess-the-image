import React, { useRef, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";

const ImageCard = ({ src }: { src: string }) => (
  <Paper elevation={3} variant="outlined" style={{ height: 500, width: 500 }}>
    <Grid container>
      <Grid item style={{ backgroundImage: src, height: 300, width: 300 }} />
      <Grid item>
        <Typography>Hello</Typography>
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
    <div>
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(event) => setFiles(Array.from(event.target.files))}
        multiple
        accept=".jpeg, .png, .jpg"
      />
      {files?.map((file) => (
        <div key={file.name}>
          <ImageCard src={URL.createObjectURL(file)} />
        </div>
      ))}
    </div>
  );
};
export default UploadPage;
