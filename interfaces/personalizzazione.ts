export type personalizzazione = {
  id: number;
  nome: string;
  prezzo: number;
}

import { Personalizzazione } from "@prisma/client";

export function mapPersonalizzazione(personalizzazione: Personalizzazione): personalizzazione {
  return {
    id: personalizzazione.id,
    nome: personalizzazione.nome,
    prezzo: personalizzazione.prezzo.toNumber()
  }
}