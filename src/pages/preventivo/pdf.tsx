import { Prisma } from '@prisma/client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'
import { Button, Image, ListGroup, Spinner, Table } from 'react-bootstrap'
import { prisma } from 'server/prisma'
import { z } from 'zod'

const invalidId = -1

const pdfSchema = z.object({
  idPreventivo: z.number(),
})

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
  if (preventivo?.locked === false) return null
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
  if (props.idPreventivo === invalidId) return <div>Invalid id</div>

  const [isButtonHidden, setButtonHidden] = useState(false)

  useEffect(() => {
    if (!isButtonHidden) return
    window.print()
    //setButtonHidden(false)
  }, [isButtonHidden])

  return (
    <div className='px-4 d-flex flex-column h-100 justify-content-between' style={{ fontSize: "0.7rem" }}>
      <div className='d-flex justify-content-between'>
        <div className='d-flex' />
        <h2 className='text-center my-auto'>Preventivo {props.preventivo.scuola}</h2>
        <Image src='/LOGOSC.svg' width={150} height={150} />
      </div>
      <Table bordered className='border-dark fs-6'>
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
      <div className='text-center'>
        <span className='fw-bold'>
          <p>
            Firmando questo documento l&lsquo;interessato/gli interessati si impegna/no a rispettare il proprio impegno nel progetto sovradescritto. <br />
          </p>
          <p>
            Firma (R) {"_".repeat(30)} Firma (SC) {"_".repeat(30)}
          </p>
        </span>
        <p className='fw-light'>
          <span className='fst-italic'>Le informazioni, i dati e le notizie contenute nella presente comunicazione e i relativi allegati sono di natura privata e come tali possono essere riservate e sono,
            comunque, destinate esclusivamente ai destinatari indicati in epigrafe. La diffusione, distribuzione e/o la copia di questi da parte di qualsiasi soggetto diverso dal
            destinatario è proibita, ai sensi dell&lsquo;art. 616 c.p. e del Reg. UE 2016/679.</span><br />
          <span>School Care • Bologna (BO) • +39 388 42 27 061</span>
        </p>
        <Button variant="primary" onClick={() => setButtonHidden(true)} hidden={isButtonHidden}>
          Stampa
        </Button>
      </div>
    </div >
  )
}
