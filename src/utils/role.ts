
export const canUnlockPreventivo = (role: string) => role != 'user'

export const canEditUser = (role: string) => role != 'user'