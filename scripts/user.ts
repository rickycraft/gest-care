import { mapUser, user } from 'interfaces/user';
import { prisma } from 'prisma/client'

export async function addUser(user: user) {
  const res = await prisma.user.create({
    data: {
      username: user.username,
      password: user.password
    }
  })
  return mapUser(res)
}

export async function editUser(user: user) {
  const res = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      username: user.username,
      password: user.password
    }
  })
  return mapUser(res)
}

export async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: {
      id: id
    }
  })
}

export async function getUser(id: number) {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    }
  })
  if (user == null) return undefined;
  else return mapUser(user)
}

export async function getUserByUsername(username: string) {
  const user = await prisma.user.findFirst({
    where: {
      username: username
    }
  })
  if (user == null) return undefined;
  else return mapUser(user)
}