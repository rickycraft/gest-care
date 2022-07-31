import { Prisma } from "@prisma/client";

export interface preventivo_row {
  prodottoId: number;
  personalizzazioneId: number;
  provvigioneSc: Prisma.Decimal;
  provvigioneRappre: Prisma.Decimal;
  provvigioneComm: Prisma.Decimal;
}

export interface preventivo {
  nome: string;
  scuolaId: number;
  fornitoreId: number;
  lastEditedUserId: number;
}