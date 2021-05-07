import React, { useEffect } from "react";
import { getLanguageCode } from "../utils/http-api-utils";

const IndexPage = () => {
  useEffect(() => {
    getLanguageCode(
      "https://s27363.pcdn.co/wp-content/uploads/2016/05/Hong-Kong-signs.jpg.optimal.jpg"
    )
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  }, []);
  return <div />;
};

export default IndexPage;
