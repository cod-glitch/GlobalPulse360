const https = require("https");

exports.handler = async function(event) {
  const url = event.queryStringParameters?.url;
  if (!url) return { statusCode: 400, body: "Missing url" };

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve({
        statusCode: 200,
        headers: {
          "Content-Type": "application/xml",
          "Access-Control-Allow-Origin": "*",
        },
        body: data,
      }));
    }).on("error", (e) => resolve({
      statusCode: 500,
      body: e.message,
    }));
  });
};
