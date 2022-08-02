export type prodotto = {
  id: number;
  nome: string;
  prezzo: number;
}

import { Prodotto } from "@prisma/client";

export function mapProdotto(prodotto: Prodotto): prodotto {
  return {
    id: prodotto.id,
    nome: prodotto.nome,
    prezzo: prodotto.prezzo.toNumber()
  }
}