import { useEffect, useState, useMemo } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { VariableSizeList as List } from "react-window";
import { asyncMap } from "@wojtekmaj/async-array-utils";

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const width = 500;
const height = width * 1.5;

// eslint-disable-next-line react/prop-types
function Row({ index, style }) {
  function onPageRenderSuccess(page) {
    console.log(`Page ${page.pageNumber} rendered`);
  }

  return (
    <div style={style}>
      <Page
        onRenderSuccess={onPageRenderSuccess}
        pageIndex={index}
        width={width}
        renderAnnotationLayer={false}
      />
    </div>
  );
}

export default function ReactWindowTest() {
  const [pdf, setPdf] = useState(null);
  const [pageViewports, setPageViewports] = useState(null);
  const file = useMemo(
    () => ({ url: "http://localhost:8000/" }),
    []
  );


  /**
   * React-Window cannot get item size using async getter, therefore we need to
   * calculate them ahead of time.
   */
  useEffect(() => {
    setPageViewports(null);

    if (!pdf) {
      return;
    }

    (async () => {
      const pageNumbers = Array.from(new Array(pdf.numPages)).map(
        (_, index) => index + 1
      );

      const nextPageViewports = await asyncMap(pageNumbers, (pageNumber) =>
        pdf.getPage(pageNumber).then((page) => page.getViewport({ scale: 1 }))
      );

      setPageViewports(nextPageViewports);
    })();
  }, [pdf]);

  function onDocumentLoadSuccess(nextPdf) {
    console.log(nextPdf)
    setPdf(nextPdf);

  }

  function getPageHeight(pageIndex) {
    if (!pageViewports) {
      throw new Error("getPageHeight() called too early");
    }

    const pageViewport = pageViewports[pageIndex];
    const scale = width / pageViewport.width;
    const actualHeight = pageViewport.height * scale;

    return actualHeight;
  }

  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      {pdf ? (
        <List
          width={width}
          height={height}
          estimatedItemSize={height}
          itemCount={pdf.numPages}
          itemSize={() => height}
        >
          {Row}
        </List>
      ) : null}
    </Document>
  );
}
