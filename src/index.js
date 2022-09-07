import express from "express";

const server = express();

server.listen(5000, () => {
  console.log("listen on 5000");
});
