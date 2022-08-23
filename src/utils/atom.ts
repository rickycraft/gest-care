import { atom } from 'jotai'

export const defaultUserAtom = {
  id: -1,
  username: '',
  isLoggedIn: false,
}
export const userAtom = atom(defaultUserAtom)
