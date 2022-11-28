import './App.css'
import { useEffect } from "react";
import recordApi from "./api/recordApi";
import { Header } from './components/Header';
import Footer from './components/Footer';
import { useRecoilState } from 'recoil';
import { atoms } from './atoms';
import RecordCreatePlane from './components/RecordCreatePlane';
import RecordListPlane from './components/RecordListPlane';

const App = () => {
  const [recordListFilter, setRecordListFilter] = useRecoilState(atoms.recordListFilter)
  const [recordList, setRecordList] = useRecoilState(atoms.recordList)

  const fetchRecordList = () => {
    recordApi.search(recordListFilter)
      .then(response => {
        const recordList = response.data
        console.log('fetchRecordList', recordList)
        setRecordList(recordList)
      })
      .catch(e => {
        console.error(e)
        alert(e.response.data.message)
      })
  }

  useEffect(() => {
    fetchRecordList()
  }, [recordListFilter])

  return (
    <>
      <Header/>
      <RecordCreatePlane fetchRecordList={fetchRecordList}/>
      <RecordListPlane/>
      <Footer/>
    </>
  )
}

export default App
