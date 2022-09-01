// highlight
import { H } from 'highlight.run'

export function setup() {
  if (process.env.NEXT_PUBLIC_H_KEY != undefined) {
    H.init(process.env.NEXT_PUBLIC_H_KEY, {
      disableConsoleRecording: true,
      networkRecording: false,
      environment: process.env.NODE_ENV,
    })
  }
}

export function identify(username: string, data: any) {
  if (process.env.NEXT_PUBLIC_H_KEY != undefined) {
    H.identify(username, data)
  }
}