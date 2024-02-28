export function TableRows({
  page = 0,
  size = 30,
  q = "",
  tees,
  users,
}: {
  page?: number;
  size?: number;
  q?: string;
  tees: Array<string>;
  users: Array<any>;
}) {
  const supposedStartIdx = page * size;
  const supposedEndIdx = supposedStartIdx + size;

  //const usersResults = await getUsers({ size, index: supposedStartIdx });

  return (
    <>
      {users.map((user, sliceIdx) => {
        const shouldRequestNextPage =
          supposedStartIdx + sliceIdx === supposedEndIdx - 1 && // is last in page
          users.length > supposedEndIdx; // is not the very last one
        return (
          <tr
            class="hover"
            hx-get={
              shouldRequestNextPage &&
              `/users${tees.reduce((strRes, tee, index) => {
                return strRes + (index === 0 ? "?" : "&") + "tees[]=" + tee;
              }, "")}`
            }
            hx-trigger={shouldRequestNextPage && "intersect once"}
            hx-swap={shouldRequestNextPage && "afterend"}
          >
            <th>
              <a class="link" href={`/users/${user.id}`}>
                {user.name}
              </a>
            </th>
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
