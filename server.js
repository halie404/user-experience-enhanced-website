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

// --- helper functions ---
async function mapWebinarData(webinar) {
  return {
    id: webinar.id,
    title: webinar.title,
    duration: webinar.duration,
    thumbnail: webinar.thumbnail,
    categories: webinar.categories,
    speakers: webinar.speakers,
  };
}

app.get("/", (req, res) => {
  res.render("index.liquid");
});

app.get("/webinars", async (req, res) => {
  try {
    const fetchWebinars = await fetch(
      webinarsEndpoint +
        "?fields=id,duration,title,thumbnail,categories.*.*,speakers.*.*"
    );

    if (!fetchWebinars.ok) {
      throw new Error(`Failed to fetch webinars: ${fetchWebinars.statusText}`);
    }

    const { data: webinarsData } = await fetchWebinars.json();
    const webinars = webinarsData.map(mapWebinarData);

    res.render("webinars.liquid", { webinars });
  } catch (error) {
    res
      .status(500)
      .render("error.liquid", { message: "Failed to load webinars." });
  }
});

app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), () => {
  console.log(`App is running on http://localhost:${app.get("port")}`);
});
