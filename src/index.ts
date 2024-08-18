import "dotenv/config";

import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.all("/", async (req, res) => {
  return res.sendStatus(200);
});

app.listen(3001, () => {
  console.log("API listening on port 3001");
});
