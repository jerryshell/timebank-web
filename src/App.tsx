import { useEffect } from "react";
import { useRecoilState } from "recoil";
import recordApi from "./api/recordApi";
import "./App.css";
import { atoms } from "./atoms";
import Footer from "./components/Footer";
import { Header } from "./components/Header";
import RecordChart from "./components/RecordChart";
import RecordCreatePlane from "./components/RecordCreatePlane";
import RecordListPlane from "./components/RecordListPlane";

const App = () => {
  const [recordListFilter, setRecordListFilter] = useRecoilState(
    atoms.recordListSearchForm,
  );
  const [recordList, setRecordList] = useRecoilState(atoms.recordList);
  const [recordListLoading, setRecordListLoading] = useRecoilState(
    atoms.recordListLoading,
  );

  const fetchRecordList = () => {
    setRecordListLoading(true);
    recordApi
      .search(recordListFilter)
      .then((response) => {
        const recordList = response.data;
        console.log("fetchRecordList", recordList);
        setRecordList(recordList);
      })
      .catch((e) => {
        console.error(e);
        alert(e.response.data.message);
      })
      .finally(() => {
        setRecordListLoading(false);
      });
  };

  useEffect(() => {
    fetchRecordList();
  }, [recordListFilter]);

  return (
    <>
      <Header />
      <RecordCreatePlane fetchRecordList={fetchRecordList} />
      <RecordChart />
      <RecordListPlane />
      <Footer />
    </>
  );
};

export default App;
