import nc from "next-connect";
import { createProxyMiddleware } from "http-proxy-middleware";
import queryString from "querystring";

// For some reason, we need to manually add/write the body data for POST
// requests to work.
// From: https://github.com/chimurai/http-proxy-middleware/issues/40#issuecomment-249430255
// From: https://github.com/http-party/node-http-proxy/blob/9b96cd725127a024dabebec6c7ea8c807272223d/examples/middleware/bodyDecoder-middleware.js#L39
// restream parsed body before proxying
const writeBody = (proxyReq, req, res, options) => {
  if (!req.body || !Object.keys(req.body).length) {
    return;
  }

  var contentType = proxyReq.getHeader("Content-Type");
  var bodyData;

  if (contentType === "application/json") {
    bodyData = JSON.stringify(req.body);
  }

  if (contentType === "application/x-www-form-urlencoded") {
    bodyData = queryString.stringify(req.body);
  }

  if (contentType.startsWith("multipart/form-data")) {
    bodyData = req.body;
  }

  if (bodyData) {
    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
};

const apiProxy = createProxyMiddleware({
  target: "https://admin.globalgoals.directory/",
  changeOrigin: true,
  pathRewrite: {
    "^/api/auth": "/.netlify/identity",
  },
  onProxyReq: writeBody,
  // Rewrite auth cookie domain
  cookieDomainRewrite: true,
});

const handler = nc().use(apiProxy);

export default handler;
