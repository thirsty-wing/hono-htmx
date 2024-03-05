import TableRows from "./tableRows";
import { Tees } from "./types/users";

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
  tees: Tees;
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
            hx-vals={tees}
            hx-trigger="input changed delay:500ms"
          />
          <fieldset class="flex justify-content-center gap-1">
            <legend>Choose tee shirt size filter:</legend>
            <label class="flex justify-content-center">
              <input
                class="checkbox"
                checked={!!tees.xs}
                name="xs"
                type="checkbox"
              />
              XS
            </label>
            <label class="flex justify-content-center">
              <input
                class="checkbox"
                checked={!!tees.s}
                name="s"
                type="checkbox"
              />
              S
            </label>
            <label class="flex justify-content-center">
              <input
                class="checkbox"
                checked={!!tees.m}
                id="m-tee-checkbox"
                name="m"
                type="checkbox"
              />
              M
            </label>
            <label class="flex justify-content-center">
              <input
                class="checkbox"
                checked={!!tees.l}
                id="l-tee-checkbox"
                name="l"
                type="checkbox"
              />
              L
            </label>
            <label class="flex justify-content-center">
              <input
                class="checkbox"
                checked={!!tees.xl}
                id="xl-tee-checkbox"
                name="xl"
                type="checkbox"
              />
              XL
            </label>
            <label class="flex justify-content-center">
              <input
                class="checkbox"
                checked={!!tees["2xl"]}
                id="2xl-tee-checkbox"
                name="2xl"
                type="checkbox"
              />
              2XL
            </label>
            <label class="flex justify-content-center">
              <input
                class="checkbox"
                checked={!!tees["3xl"]}
                id="3xl-tee-checkbox"
                name="3xl"
                type="checkbox"
              />
              3XL
            </label>
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
