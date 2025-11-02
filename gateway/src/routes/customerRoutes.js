const express = require("express");
const proxy = require("express-http-proxy");

const router = express.Router();
const target = process.env.CUSTOMER_SERVICE || "http://localhost:8082";

// 🔹 No demo header — just forward Authorization properly
const customerProxy = proxy(target, {
  proxyReqPathResolver: (req) => `/api${req.url}`,
  proxyReqOptDecorator: (opts, srcReq) => {
    const auth = srcReq.headers["authorization"];
    if (auth) opts.headers["authorization"] = auth;
    opts.headers["content-type"] =
      srcReq.headers["content-type"] || "application/json";
    return opts;
  },
});

router.use("/", customerProxy);

module.exports = router;
