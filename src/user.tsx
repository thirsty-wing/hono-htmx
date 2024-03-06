import { User } from "./types/users";

interface UserProps {
  user: User;
}

function User({ user }: UserProps) {
  return (
    <div
      class="flex flex-col items-start gap-3"
      hx-target="this"
      hx-swap="outerHTML"
    >
      <h1>Name {user.name}</h1>
      <h2>email: {user.email}</h2>
      <h2>city: {user.city}</h2>
      <h2>department: {user.department}</h2>
      <h2>T-shirt size: {user.t_shirt_size}</h2>
      <button class="btn btn-primary" hx-get={`/users/${user.id}`} id="edit">
        Edit
      </button>
    </div>
  );
}

export default User;
