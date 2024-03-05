import { Tees } from "./types/users";

export function TableRows({
  offset = 0,
  size = 30,
  q = "",
  tees,
  users,
}: {
  offset?: number;
  size?: number;
  q?: string;
  tees: Tees;
  users: Array<any>;
}) {
  const queryParams: Array<string> = [
    `offset=${offset + size}`,
    `size=${size}`,
    `q=${q}`,
  ];

  Object.keys(tees).forEach((key) => {
    if (!tees[key as keyof Tees]) {
      return;
    }

    queryParams.push(`${key}=${tees[key as keyof Tees]}`);
  });

  return (
    <>
      {users.map((user, sliceIdx) => {
        const supposedEndIdx = offset + size;
        const shouldRequestNextPage = offset + sliceIdx === supposedEndIdx - 1; // is last in page
        console.log(
          "offset + sliceIdx:",
          offset + sliceIdx,
          "supposedEndIdx - 1:",
          supposedEndIdx - 1
        );
        return (
          <tr
            class="hover"
            hx-get={shouldRequestNextPage && `/users?${queryParams.join("&")}`}
            hx-trigger={shouldRequestNextPage && "intersect once"}
            hx-swap={shouldRequestNextPage && "afterend"}
          >
            <td>
              <a class="link" href={`/users/${user.id}`}>
                {user.name}
              </a>
            </td>
            <td>{user.email}</td>
            <td>{user.city}</td>
            <td>{user.department}</td>
            <td>{user.t_shirt_size.toUpperCase()}</td>
          </tr>
        );
      })}
    </>
  );
}

export default TableRows;
