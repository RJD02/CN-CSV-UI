import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import homeRouter from "./routes/home.route";
import cors from "cors";
import tableRouter from "./routes/table.route";
import fileRouter from "./routes/files.route";

const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use('/table', tableRouter);
app.use("/files", fileRouter);
app.use("/", homeRouter);

app.listen(PORT, () => console.log("Server running on port:", PORT));
