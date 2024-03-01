import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import Layout from "./layout";
import Users from "./users";
import TableRows from "./tableRows";
import { Pool } from "pg";

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
  const tees = c.req.queries("tees") ?? [];
  const size = parseInt(c.req.query("size") ?? "30");

  let offset;

  if (hxRequest && hxTrigger !== "filters" && hxTrigger !== "searchform") {
    offset = parseInt(c.req.query("offset") ?? "0");
  }

  const conditionalsList: string[] = [];

  if (q) {
    conditionalsList.push(`name LIKE '%${q}%'`);
  }

  if (tees.length > 0) {
    conditionalsList.push(
      "( " + tees.map((tee) => `t_shirt_size = '${tee}'`).join(" OR ") + " )"
    );
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

  console.log(query);

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
