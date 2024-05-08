const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production"; // make sure to have the NODE_ENV on the env 
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;      

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

// run yarn build or next build to build for production
