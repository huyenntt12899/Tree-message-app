import express from "express";
import { AppDataSource } from "./config/ormconfig";
import auth from "./routes/authRoutes";
import messageRoutes from "./routes/messageRoutes";

const cors = require("cors");

export const app = express();
// Enable CORS
app.use(cors());

const PORT = process.env.PORT ?? 4000;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app.use(express.json());
app.use("/auth", auth);
app.use("/messages", messageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
