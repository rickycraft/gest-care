import { personalizzazione } from 'interfaces/personalizzazione';
import { prodotto } from 'interfaces/prodotto';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router'
import { getPersonalizzazioni, getProdotti } from 'scripts/fornitore';
import useSwr from 'swr';
import { preventivo } from '../interfaces/preventivo';
import { fetcher } from '../scripts/utils';

type serverData = {
  prodotti: prodotto[];
  pers: personalizzazione[];
}

const Tester = (serverData: serverData) => {
  const router = useRouter()
  const id = Number(router.query.id)
  if (Number.isNaN(id)) {
    return <div>Not a valid Id</div>
  }
  console.log(serverData)

  const { data, error } = useSwr<preventivo>(
    `/api/preventivo/${id}/header`, fetcher
  )
  //const {data, error} = getPreventivo(router.query.id)
  if (error) return <div>Failed to load user</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className="container text-center mt-3">
      <h2>{data.nome}</h2>
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {

  const id = Number(context.query.id)
  if (Number.isNaN(id)) {
    return {
      props: { prodotti: [], pers: [] }
    }
  }

  const pers = await getPersonalizzazioni(id);
  const prodotti = await getProdotti(id);
  // Pass data to the page via props
  return { props: { prodotti, pers } }
}

export default Tester
