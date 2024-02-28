import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import Layout from "./layout";
import Users from "./users";
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
  const q = c.req.query("q");
  const tees = c.req.queries("tees[]") ?? [];
  const offset = c.req.query("offset") ?? 0;
  const size = c.req.query("size") ?? 30;
  const hxTrigger = c.req.header("hx-trigger");

  const conditionalsList: string[] = [];

  if (q) {
    conditionalsList.push(`name LIKE '%${q}%'`);
  }

  if (tees.length > 0) {
    conditionalsList.push(
      "( " + tees.map((tee) => `t_shirt_size = '${tee}'`).join(" OR ") + " )"
    );
  }

  const conditionals = conditionalsList.reduce((result, conditional, index) => {
    return result + (index === 0 ? "WHERE " : " AND ") + conditional;
  }, "");

  const query = `
  SELECT id, name, username, email, city, department, t_shirt_size
  FROM USERS ${conditionals} OFFSET ${offset} LIMIT ${size}`;

  console.log(query);

  const result = await pool.query(query);

  return c.html(
    <Layout title="Users">
      <Users users={result.rows} q={q} tees={tees} />
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
