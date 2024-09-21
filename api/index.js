import dotenv from "dotenv";
import express from "express";
import scraper from "../scraper/instagram.js";
dotenv.config();

const app = express();

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "It's working!",
    data: [
      {
        name: "@imniwa",
        message: `${process.env.APP_NAME}`,
      },
    ],
  });
});

app.get("/:username", async (req, res) => {
  const data = await scraper(req.params.username);
  return res.status(200).json({
    message: "It's working!",
    data,
  });
});

app.listen(3000, () => console.log("Server ready on port 3000."));
export default app;
