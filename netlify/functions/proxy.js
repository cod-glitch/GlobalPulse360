const https = require("https");
const http = require("http");

exports.handler = async function(event) {
  const url = event.queryStringParameters?.url;
  if (!url) return { statusCode: 400, body: "Missing url param" };

  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GlobalPulse360/1.0)",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      }
    }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve({
        statusCode: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300",
        },
        body: data,
      }));
    }).on("error", (e) => resolve({
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    }));
  });
};
          
