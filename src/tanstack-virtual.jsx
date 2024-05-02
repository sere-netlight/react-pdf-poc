import { useVirtualizer  } from '@tanstack/react-virtual'
import { useState, useMemo, useRef } from "react";
import { pdfjs, Document, Page } from "react-pdf";

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import './index.css'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const width = 583;
const height = 900;


// eslint-disable-next-line react/prop-types
function Row({ index, style }) {
  function onPageRenderSuccess(page) {
    console.log(`Page ${page.pageNumber} rendered`);
  }

  return (
    <div style={style}>
      <Page
        loading={
          <div style={{width: 583, height:774, display:'flex', justifyContent:"center", alignItems: "center"}} >
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
          </div>
        }
        onRenderSuccess={onPageRenderSuccess}
        pageIndex={index}
        width={width}
      />
    </div>
  );
}


// eslint-disable-next-line react/prop-types
function RowVirtualizerDynamic({count}) {
  const ref = useRef(null)

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => ref.current,
    estimateSize: () => height,
  })

  const items = virtualizer.getVirtualItems()

  return (
    <div>
      <button
        onClick={() => {
          virtualizer.scrollToIndex(0)
        }}
      >
        scroll to the top
      </button>
      <span style={{ padding: '0 4px' }} />
      <button
        onClick={() => {
          virtualizer.scrollToIndex(30)
        }}
      >
        scroll to the middle
      </button>
      <span style={{ padding: '0 4px' }} />
      <button
        onClick={() => {
          virtualizer.scrollToIndex(count - 1)
        }}
      >
        scroll to the end
      </button>
      <hr />



      <div
        ref={ref}
        className="List"
        style={{
          height: height,
          width: width,
          overflowY: 'auto',
          contain: 'strict',
        }}
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${items[0]?.start ?? 0}px)`,
            }}
          >
            {items.map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={
                  virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'
                }
              >
                <Row index={virtualRow.index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


const Wrapper = () => {
  const [pdf, setPdf] = useState(null);
  const file = useMemo(
    () => ({ url: "http://localhost:8000/" }),
    []
  );


  function onDocumentLoadSuccess(nextPdf) {
    console.log(nextPdf)
    setPdf(nextPdf);
  }
  
  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      {
        pdf ? (
          <RowVirtualizerDynamic count={pdf.numPages}/>
        ) : null
      }
    </Document>
  )
}
export default Wrapper