import axios from "axios";

const getImage = async (query) => {
  return axios
    .get("/api/pexels", {
      params: {
        query: query,
      },
    })
    .then((e) => {
      return e.data;
    })
    .catch((e) => {
      console.log(e);
      return;
    });
};

export { getImage };
