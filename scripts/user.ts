import { mapUser, user } from 'interfaces/user';
import { prisma } from 'prisma/client'

export async function createUser(username: string, password: string) {
  try {
    const res = await prisma.user.create({
      data: {
        username: username,
        password: password
      }
    })
    return mapUser(res)
  } catch (e) {
    console.error(e)
    return undefined
  }
}

export async function updateUser(user: user) {
  try {
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
  } catch (e) {
    console.error(e)
    return undefined
  }
}

export async function deleteUser(id: number) {
  try {
    return await prisma.user.delete({
      where: {
        id: id
      }
    })
  } catch (e) {
    console.error(e)
    return undefined
  }
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