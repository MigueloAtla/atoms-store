import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

// components
import Table from '@/admin/components/table'

// hooks
import usePrepareTable from '@/admin/hooks/prepareDocsTable'

export const RelatedDocs = ({
  relation,
  removeList,
  setRemoveList,
  id
}) => {

  useEffect(() => {
    console.log(removeList)
  }, [removeList])

  let history = useHistory()

  const { data, columns } = usePrepareTable({ 
    collection: relation.content,
  })

  const onClick= (id) => {
    history.push(`/admin/${relation.collection}/${id}`)
  }

  return (
    <>
      <Table 
        columns={columns} 
        data={data} 
        onClick={onClick}
        setRemoveList={setRemoveList}
        junctionName={relation.junctionName}
        id={id}
        styleType='relatedDocs'
        fixedFooter={false}
      />
  </>
  )
}