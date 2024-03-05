import TableRows from "./tableRows";

export function Users({
  offset = 0,
  size = 0,
  users,
  q = "",
  tees,
}: {
  offset?: number;
  size?: number;
  users: Array<any>;
  q?: string;
  tees: Array<string>;
}) {
  return (
    <main class="flex gap-24 flex-1 h-screen">
      <aside class="border-solid border-gray-500 border-r-2 w-100 p-8">
        <nav>
          <ul>
            <a href="/users">Users</a>
          </ul>
        </nav>
      </aside>
      <div class="flex flex-col p-8">
        <form action="/users" id="filters" hx-replace-url="true">
          <input
            class="input input-bordered"
            type="search"
            name="q"
            placeholder="search for users..."
            value={q}
            hx-get="/users"
            hx-replace-url="true"
            hx-swap="innerHTML scroll:#table-container:top"
            hx-target="#table-body"
            hx-vals={`{${tees.map((tee) => `tees=${tee}`).join(", ")}}`}
            hx-trigger="input changed delay:500ms"
          />
          <fieldset class="flex justify-content-center">
            <legend>Choose tee shirt size filter:</legend>
            <input
              class="checkbox"
              checked={tees.includes("xs")}
              id="xs-tee-checkbox"
              name="tees"
              type="checkbox"
              value="xs"
            />
            <label for="xs-tee-checkbox">XS</label>
            <input
              class="checkbox"
              checked={tees.includes("s")}
              id="s-tee-checkbox"
              name="tees"
              type="checkbox"
              value="s"
            />
            <label for="s-tee-checkbox">S</label>
            <input
              class="checkbox"
              checked={tees.includes("m")}
              id="m-tee-checkbox"
              name="tees"
              type="checkbox"
              value="m"
            />
            <label for="m-tee-checkbox">M</label>
            <input
              class="checkbox"
              checked={tees.includes("l")}
              id="l-tee-checkbox"
              name="tees"
              type="checkbox"
              value="l"
            />
            <label for="l-tee-checkbox">L</label>
            <input
              class="checkbox"
              checked={tees.includes("xl")}
              id="xl-tee-checkbox"
              name="tees"
              type="checkbox"
              value="xl"
            />
            <label for="xl-tee-checkbox">XL</label>
            <input
              class="checkbox"
              checked={tees.includes("2xl")}
              id="2xl-tee-checkbox"
              name="tees"
              type="checkbox"
              value="2xl"
            />
            <label for="2xl-tee-checkbox">2XL</label>
            <input
              class="checkbox"
              checked={tees.includes("3xl")}
              id="3xl-tee-checkbox"
              name="tees"
              type="checkbox"
              value="3xl"
            />
            <label for="3xl-tee-checkbox">3XL</label>
          </fieldset>
          <input class="btn" type="submit" value="Apply Filters" />
        </form>
        <div class="flex overflow-auto pb-8" id="table-container">
          <table class="table table-fixed">
            <thead class="sticky top-0 light:bg-gray-300 dark:bg-gray-800">
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Department</th>
                <th>Shirt Size</th>
              </tr>
            </thead>
            <tbody id="table-body">
              <TableRows
                offset={offset}
                size={size}
                users={users}
                q={q}
                tees={tees}
              />
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Users;
