import React, { useLayoutEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import WebOfficePage from "./pages/WebOfficePage";
import WebOfficePage1 from "./pages/WebOfficePage";
import Header from "./components/Header";
import { page1, page2, page5 } from "./pages/WebOfficePage/FillForm/data";
import router from "./routers";
function App() {
  const list = [
    {
      fileId: "1",
      fileName: "showDoc1.docx",
      fieldList: [...page1],
    },
    {
      fileId: "fe2e215d9f30480fa3ff2c93b8c5b763",
      fileName: "showTableDoc1.docx",
      fieldList: [...page5],
    },
  ];
  const [currentFile, setCurrentFile] = useState(list[0]);
  const handleFileChange = (file: any) => {
    setCurrentFile(file);
  };

  return (
    <RouterProvider router={router}>
      <React.Fragment>
        {/* <WebOfficePage></WebOfficePage> */}

      </React.Fragment>
    </RouterProvider>
  );
}

export default App;
