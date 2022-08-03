import { NextApiRequest, NextApiResponse } from "next";

export async function fetcher(url: string) {
  const res = await fetch(url);
  return await res.json();
}

export function getIdFromReq(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id)
  if (Number.isNaN(id)) {
    res.status(400).end()
    return null
  } else {
    return id
  }
}