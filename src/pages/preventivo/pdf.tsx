import { Prisma } from '@prisma/client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Script from 'next/script'
import { Image, Table } from 'react-bootstrap'
import { prisma } from 'server/prisma'
import { z } from 'zod'

const invalidId = -1

const addDecimals = (values: Prisma.Decimal[]) => {
  const tot = values.reduce((acc, curr) => acc.add(curr), new Prisma.Decimal(0))
  return tot.toNumber().toFixed(2)
}

const getRows = async (idPreventivo: number) => {
  const prevRows = await prisma.preventivoRow.findMany({
    where: {
      preventivoId: idPreventivo,
    },
    select: {
      id: true,
      prodotto: {
        select: {
          nome: true,
          prezzo: true,
        },
      },
      personalizzazione: {
        select: {
          nome: true,
          prezzo: true,
        },
      },
      provvigioneComm: true,
      provvigioneRappre: true,
      provvigioneSC: true,
    }
  })
  return prevRows.map(row => {
    return {
      id: row.id,
      prodotto: row.prodotto.nome,
      perso: row.personalizzazione.nome,
      totale: addDecimals([row.prodotto.prezzo, row.personalizzazione.prezzo, row.provvigioneComm, row.provvigioneRappre, row.provvigioneSC]),
    }
  })
}

const getPreventivo = async (idPreventivo: number) => {
  const preventivo = await prisma.preventivo.findFirst({
    where: { id: idPreventivo },
    select: {
      locked: true,
      scuola: true
    }
  })
  // if (preventivo?.locked === false) return null
  return preventivo
}

const getOptions = async (idPreventivo: number) => {
  const preventivo = await prisma.preventivo.findFirstOrThrow({
    where: { id: idPreventivo },
    select: {
      options: {
        select: {
          id: true,
          nome: true,
          selected: true,
        }
      }
    }
  })
  return preventivo.options
}

const invalidProps = {
  props: { idPreventivo: invalidId }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const idPreventivo = Number(id)
  if (isNaN(idPreventivo)) return invalidProps

  const preventivo = await getPreventivo(idPreventivo)
  if (preventivo == null) return invalidProps
  const rows = await getRows(idPreventivo)
  const options = await getOptions(idPreventivo)

  return {
    props: {
      idPreventivo,
      preventivo,
      rows,
      options,
    },
  }
}

type Row = {
  id: number
  prodotto: string
  perso: string
  totale: number
}

type Option = {
  id: number
  nome: string
  selected: boolean
}

export default function PreventivoPdf(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const opt = { image: { type: 'png', quality: 1 } }

  if (props.idPreventivo === invalidId) return <div>Invalid id</div>

  return (
    <div className='px-4 h-100 bg-white' style={{ fontSize: "12pt" }}>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg=="
        crossOrigin="anonymous" referrerPolicy="no-referrer"
        onReady={() => {
          (window as any).html2pdf().from(document.body).set(opt).save('preventivo_' + props.preventivo.scuola + '.pdf')
        }}
      />
      <div className='d-flex justify-content-between mb-3'>
        <div className='d-flex' />
        <h2 className='text-center my-auto'>Preventivo {props.preventivo.scuola}</h2>
        <Image src='/logo_sc.png' width={150} height={150} alt="sc-logo" />
      </div>
      <div>
        <Table bordered className='border-dark fs-5'>
          <thead className='bg-warning'>
            <tr>
              <th>Prodotto</th>
              <th>Personalizzazione</th>
              <th>Totale</th>
            </tr>
          </thead>
          <tbody>
            {props.rows.map((row: Row) => (
              <tr key={row.id}>
                <td>{row.prodotto}</td>
                <td>{row.perso}</td>
                <td>{row.totale}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h6>In tabella è indicato la bozza del preventivo dei prodotti SC con personalizzazione richiesta dai rappresentanti.</h6>
      </div>
      <div>
        <span>Il prezzo include:</span>
        <ul>
          {props.options.filter((option: Option) => option.selected)
            .map((option: Option) => (
              <li key={option.id}>
                {option.nome}
              </li>
            ))}
        </ul>
      </div>
      <div className='text-center mt-5'>
        <span className='fw-bold'>
          <p>
            Firmando questo documento l&lsquo;interessato/gli interessati si impegna/no a rispettare il proprio impegno nel progetto sovradescritto. <br />
          </p>
          <p>
            Firma (R) {"_".repeat(30)} Firma (SC) {"_".repeat(30)}
          </p>
        </span>
        <p className='fw-light'>
          <span className='fst-italic' style={{ fontSize: "8pt" }}>Le informazioni, i dati e le notizie contenute nella presente comunicazione e i relativi allegati sono di natura privata e come tali possono essere riservate e sono,
            comunque, destinate esclusivamente ai destinatari indicati in epigrafe. La diffusione, distribuzione e/o la copia di questi da parte di qualsiasi soggetto diverso dal
            destinatario è proibita, ai sensi dell&lsquo;art. 616 c.p. e del Reg. UE 2016/679.</span><br />
          <span>School Care • Bologna (BO) • +39 388 42 27 061</span>
        </p>
      </div>
    </div >
  )
}
