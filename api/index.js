import dotenv from "dotenv";
import express from "express";
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

app.get("/:username", (req, res) => {
  res.status(200).json({
    message: "It's working!",
    data: [
      {
        name: req.params.username,
      },
    ],
  });
});

app.listen(3000, () => console.log("Server ready on port 3000."));
export default app;
