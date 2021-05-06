import React, { useEffect } from "react";
import vision from "@google-cloud/vision";

const IndexPage = () => {
  const client = new vision.ImageAnnotatorClient();

  console.log(process.env.GATSBY_GOOGLE_APPLICATION_CREDENTIALS);
  useEffect(() => {
    if (client) {
      client
        .textDetection(
          "https://www.frenchentree.com/wp-content/uploads/2015/09/Je-parle-Francais.jpg"
        )
        .then((data) => {
          console.log(data);
        });
    }
  });

  return <div />;
};

export default IndexPage;
