import express from "express";

const app = express();
app.use(express.json());

app.all("/", async (req, res) => {
  return res.sendStatus(200);
});

app.listen(3001, () => {
  console.log("API listening on port 3000");
});
