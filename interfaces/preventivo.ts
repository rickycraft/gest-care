export type preventivo_row = {
  prodottoId: number;
  personalizzazioneId: number;
  provvigioneSc: number;
  provvigioneRappre: number;
  provvigioneComm: number;
}

export type preventivo = {
  nome: string;
  scuolaId: number;
  fornitoreId: number;
  lastEditedUserId: number;
}

import { Preventivo, PreventivoRow } from "@prisma/client";

export function mapPreventivoRow(preventivoRow: PreventivoRow): preventivo_row {
  return {
    prodottoId: preventivoRow.prodottoId,
    personalizzazioneId: preventivoRow.personalizzazioneId,
    provvigioneSc: preventivoRow.provvigioneSC.toNumber(),
    provvigioneRappre: preventivoRow.provvigioneRappre.toNumber(),
    provvigioneComm: preventivoRow.provvigioneComm.toNumber()
  };
}

export function mapPreventivo(preventivo: Preventivo): preventivo {
  return {
    nome: preventivo.nome,
    scuolaId: preventivo.scuolaId,
    fornitoreId: preventivo.fornitoreId,
    lastEditedUserId: preventivo.userId
  }
}