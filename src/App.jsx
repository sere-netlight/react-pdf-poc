
import { useCallback, useState, useMemo } from 'react';
import {Document, Page, pdfjs} from "react-pdf"
import './App.css';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();


// eslint-disable-next-line react/prop-types
const MyPage = ({file, pageNumber}) => {
    return (
    <Document file={file}  >
      <Page pageNumber={pageNumber}></Page>
    </Document>)
}

function App() {
  const [pdf, setPdf] = useState('')


  const [pageNumber, setPageNumber] = useState(1)
  const [paginatiob, setPagination] = useState(0)


  const fetchPdf = useCallback(async ()=>{
    const response0 = await fetch("http://localhost:8000")

    const pdf0 = await response0.json()
    setPdf(pdf0.pdf)

  }, [])



  return (
    <div className="App">
      <h1>Hello world</h1>
      <input value={paginatiob} onChange={(e) => setPagination(e.target.value)}></input>

      <button onClick={fetchPdf}>Fetch PDF</button>

      {pdf && <MyPage file={`data:application/pdf;base64,${pdf}`} pageNumber={pageNumber}/>}

      <div style={{display: 'flex'}}>   
        <button onClick={()=> setPageNumber((prev) => prev-1)}>earlier</button>
        <p>{pageNumber}</p>
        <button onClick={()=> setPageNumber((prev) => prev+1)}>next</button>
      </div>
    </div>
  );
}

export default App;