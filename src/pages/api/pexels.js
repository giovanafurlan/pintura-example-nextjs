const axios = require("axios");

export default function handler(req, res) {
  const query = req.query.query;

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.pexels.com/v1/search?query=${query}&per_page=1`,
    headers: {
      Authorization: "y3nZ93mYNnkUDxmiR4mR2O5nAzwfX4OrTUbbRFm4wy5vKQOsrPdHmmwx",
    },
  };

  axios
    .request(config)
    .then((response) => {
      res.status(200).json(response.data);
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}
