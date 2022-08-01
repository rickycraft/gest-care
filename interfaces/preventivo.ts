import { Prisma } from "@prisma/client";

export type preventivo_row = {
  prodottoId: number;
  personalizzazioneId: number;
  provvigioneSc: Prisma.Decimal;
  provvigioneRappre: Prisma.Decimal;
  provvigioneComm: Prisma.Decimal;
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
    provvigioneSc: preventivoRow.provvigioneSC,
    provvigioneRappre: preventivoRow.provvigioneRappre,
    provvigioneComm: preventivoRow.provvigioneComm
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