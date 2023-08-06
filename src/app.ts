import express, { Request, Response } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { getFileData } from "./utils/csvCaching";
import homeRouter from "./routes/home.route";

const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.static(path.join(__dirname, "public")));

const getData = async () => {
  const data = await getFileData(1, 3, "./data/sample.csv");
  console.log(data);
};

getData();

app.use('/', homeRouter);

app.get("/", (req: Request, res: Response) => {
  res.render("index", { title: "Home" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});

app.listen(PORT, () => console.log("Server running on port:", PORT));
