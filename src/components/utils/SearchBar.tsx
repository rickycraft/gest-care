import useDebounce from 'components/utils/hooks'
import { useEffect, useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { MdOutlineBlock, MdSearch } from 'react-icons/md'

const MIN_SEARCH_LENGTH = 4

export default function SearchBar(
  { updateSearch }: { updateSearch: (search: string) => void }
) {

  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search)

  useEffect(() => {
    if (debounceSearch.length < MIN_SEARCH_LENGTH
      && debounceSearch.length != 0) return
    updateSearch(debounceSearch)
  }, [debounceSearch])

  return (
    <InputGroup>
      <InputGroup.Text>
        <MdSearch />
      </InputGroup.Text>
      <Form.Control
        placeholder='inserisci almeno 4 caratteri'
        value={search}
        isInvalid={search.length < MIN_SEARCH_LENGTH && search.length != 0}
        onChange={(e) => setSearch(e.target.value)}
      />
      <InputGroup.Text
        onClick={() => setSearch('')}
        className='px-3'>
        <MdOutlineBlock />
      </InputGroup.Text>
    </InputGroup>
  )
}