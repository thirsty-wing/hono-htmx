import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import Layout from "./layout";
import Users from "./users";
import TableRows from "./tableRows";
import { Pool } from "pg";
import { Tees } from "./types/users";

const pool = new Pool({
  user: "myuser",
  host: "localhost",
  database: "mydatabase",
  password: "mypassword",
  port: 5432,
});

const app = new Hono();

app.use("/static/global.css", serveStatic({ path: "./src/output.css" }));

// TODO: serve and consume the gzipped version
app.use(
  "/static/htmx.js",
  serveStatic({ path: "./node_modules/htmx.org/dist/htmx.min.js" })
);

app.get("/", (c) => {
  return c.redirect("/users");
});

app.get("/users", async (c) => {
  const hxTrigger = c.req.header("hx-trigger");
  const hxRequest = c.req.header("hx-request");
  const q = c.req.query("q");
  const size = parseInt(c.req.query("size") ?? "30");

  const tees: Tees = {
    xs: c.req.query("xs"),
    s: c.req.query("s"),
    m: c.req.query("m"),
    l: c.req.query("l"),
    xl: c.req.query("xl"),
    "2xl": c.req.query("2xl"),
    "3xl": c.req.query("3xl"),
  };

  let offset;

  if (hxRequest && hxTrigger !== "filters" && hxTrigger !== "searchform") {
    offset = parseInt(c.req.query("offset") ?? "0");
  }

  const conditionalsList: string[] = [];

  if (q) {
    conditionalsList.push(`name LIKE '%${q}%'`);
  }

  const teeConditionals: Array<string> = [];

  Object.keys(tees).forEach((key) => {
    if (!tees[key as keyof Tees]) {
      return;
    }

    teeConditionals.push(`t_shirt_size = '${key}'`);
  });

  if (teeConditionals.length > 0) {
    conditionalsList.push(`( ${teeConditionals.join(" OR ")} )`);
  }

  const offsetPart = offset ? `OFFSET ${offset}` : "";

  const conditionalsPart = conditionalsList.reduce(
    (result, conditional, index) => {
      return result + (index === 0 ? "WHERE " : " AND ") + conditional;
    },
    ""
  );

  const query = `
  SELECT id, name, username, email, city, department, t_shirt_size
  FROM users ${conditionalsPart} ${offsetPart} LIMIT ${size}`;

  const result = await pool.query(query);

  if (hxRequest && hxTrigger !== "filters" && hxTrigger !== "searchform") {
    return c.html(
      <TableRows users={result.rows} offset={offset} size={size} tees={tees} />
    );
  }

  return c.html(
    <Layout title="Users">
      <Users
        users={result.rows}
        q={q}
        tees={tees}
        size={size}
        offset={offset}
      />
    </Layout>
  );
});

app.get("/users/:id", (c) => {
  const id = c.req.param("id");

  return c.html(
    <Layout>
      <h1>I am user {id}</h1>
    </Layout>
  );
});

export default app;
