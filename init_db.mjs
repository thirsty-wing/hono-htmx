import pg from "pg";
const { Client } = pg;
import { faker } from "@faker-js/faker";

const client = new Client({
  user: "myuser",
  host: "localhost",
  database: "mydatabase",
  password: "mypassword",
  port: 5432,
});

await client.connect();

await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

await client.query(`
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM pg_type WHERE typname = 't_shirt_size') THEN
    CREATE TYPE t_shirt_size AS ENUM ('xs', 's', 'm', 'l', 'xl', '2xl', '3xl');
  END IF;
END$$;
`);

await client.query(`
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    t_shirt_size t_shirt_size NOT NULL
);
`);

const user_create =
  "INSERT INTO users(username, email, name, city, department, t_shirt_size) VALUES ($1, $2, $3, $4, $5, $6);";
for (let i = 0; i < 10000; i++) {
  await client.query({
    text: user_create,
    values: [
      faker.internet.userName(),
      faker.internet.email(),
      faker.person.fullName(),
      faker.location.city(),
      faker.commerce.department(),
      faker.helpers.arrayElement(["xs", "s", "m", "l", "xl", "2xl", "3xl"]),
    ],
  });
}

await client.end();
