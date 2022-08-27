import { atomWithStorage } from 'jotai/utils'

export const defaultUserAtom = {
  id: -1,
  username: '',
  role: '',
  isLoggedIn: false,
}
export const userAtom = atomWithStorage('user', defaultUserAtom)
