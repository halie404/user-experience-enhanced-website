import express from "express";
import { Liquid } from "liquidjs";
import fetch from "node-fetch";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const engine = new Liquid();
app.engine("liquid", engine.express());
app.set("view engine", "liquid");
app.set("views", "./views");

// --- base api url ---
const directusApiBaseUrl = "https://fdnd-agency.directus.app/items";

// --- endpoints for webinars + bookmarks ---
const webinarsEndpoint = `${directusApiBaseUrl}/avl_webinars`;
const categoriesEndpoint = `${directusApiBaseUrl}/avl_categories`;
const bookmarksEndpoint = `${directusApiBaseUrl}/avl_messages`;

app.get("/", (req, res) => {
  res.render("index.liquid");
});

app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), () => {
  console.log(`App is running on http://localhost:${app.get("port")}`);
});
