import { Preventivo, PreventivoRow } from "@prisma/client";
import { preventivo, preventivo_row } from "../../model/preventivo";

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