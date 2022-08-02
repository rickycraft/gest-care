export type user = {
  id: number;
  username: string;
  password: string;
}

import { User } from "@prisma/client";

export function mapUser(user: User): user {
  return {
    id: user.id,
    username: user.username,
    password: user.password
  }
}