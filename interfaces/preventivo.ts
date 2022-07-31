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