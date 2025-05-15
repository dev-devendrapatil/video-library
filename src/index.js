import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env/.env",
});
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() =>
    app.listen(PORT, () => {
      console.log("server is running on port", PORT);
    })
  )
  .catch((error) => {
    console.log("problem in connect to db", error.message);
  });
