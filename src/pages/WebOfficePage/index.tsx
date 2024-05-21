import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import axios from "axios";
import _ from "lodash";
import FillForm from "./FillForm";
import data, { page1 } from "./FillForm/data";
import { Form } from "antd";

function flatten(arr) {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val),
    []
  );
}
let tableData = [
  [
    "1",
    "气体压强传感器",
    "▲测量范围：0 kPa ~300 kPa；分度：0.1 kPa；，配件：20ml 注射器",
    "▲测量范围：0 kPa ~300 kPa；分度：0.1 kPa；，配件：20ml 注射器",
    "无",
    "无",
  ],
  [
    "2",
    "PH酸碱值传感器",
    "▲量程：0~14，精度：0.01",
    "▲量程：0~14，精度：0.01",
    "无",
    "无",
  ],
  [
    "3",
    "温度传感器",
    "▲量程：-20℃~+130℃；分度：0.1℃;不锈钢探针，可测各种物体或溶液的温度",
    "▲量程：-20℃~+130℃；分度：0.1℃;不锈钢探针，可测各种物体或溶液的温度",
    "无",
    "无",
  ],
];

export default (props: any) => {
  const webOfficeContainerRef = useRef(null);
  const [fileId, setFileId] = useState("ac18af34a6a64b069a424b05056cac38");
  const [fieldList, setfieldList] = useState(flatten(page1));
  const [fileName, setFileName] = useState("test.docx");
  const webOfficeConfig = {
    appId: "SX20240507FLZJFO",
    officeType: "w",
    fileId: fileId,
    token: "1",
  };
  const [formObj] = Form.useForm();
  const ref = React.createRef<any>();
  const [app, setApp] = useState<any>(null);
  const [instance, setInstance] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [tables, setTables] = useState(null);
  const [FormItems, setFormItems] = useState([]);
  const [isTable, setIsTable] = useState(false);
  const init = async (config: any) => {
    if (instance) {
      instance.destroy();
    }
    const inst = WebOfficeSDK.init({
      ...config,
      mount: webOfficeContainerRef?.current,
    });
    setInstance(inst);
    await inst.ready();
    setApp(inst?.Application);

    const handleApiEvent = _.debounce(async (data) => {
      const { begin, end } = data;
      if (begin == end) {
        return;
      }

      setSelectArea(inst.Application, begin, end);
      console.log({ begin, end });

      // const contextText = await getTextByRange(
      //   inst?.Application,
      //   begin - 20,
      //   end
      // );

      //   console.log("contextText", contextText.split(""));
      //   const text: string = await getTextByContext("2321");

      //   replaceText(inst?.Application, begin, end, text);
    }, 1000);
    inst.ApiEvent.AddApiEventListener("WindowSelectionChange", handleApiEvent);
    inst.ApiEvent.AddApiEventListener("CurrentPageChange", (data) => {
      console.log("CurrentPageChange: ", data);
      setPageNum(data);
    });

    if (fileName == "showTableDoc1.docx") {
      setIsTable(true);
    } else {
      setIsTable(false);
    }
    // batchSetTextArea(
    //   inst.Application,

    //   page1
    // );
  };
  useEffect(() => {}, [pageNum]);
  const getTable = async () => {
    const table1 = await getTableByIndex(tables, 1);
    const columns = table1.Columns;
    console.log("columns", columns);
  };
  // 通过添加公文域设置的name值获取对应的区域，设置值
  const updateDocumentField = async (name: string, value: any) => {
    // 公文域集合的单个公文域
    const documentField = await app.ActiveDocument.DocumentFields.Item({
      Name: name,
    });
    // 设置公文域的值
    documentField.Value = value;
  };
  // 移动光标
  const moveMouse = async (start: number, end: number) => {
    const range = await app.ActiveDocument.Range.SetRange(start, end);
  };
  // 设置选取range
  const setSelectArea = (app: any, start: number, end: number) => {
    app.ActiveDocument.DocumentFields.Add({
      Name: "1",
      Range: { Start: start, End: end },
      Hidden: false, // 是否隐藏，默认 false
      PrintOut: true, // 是否可打印，默认 true
      ReadOnly: true, // 是否只读，默认 false
    });
  };
  // 批量添加公文域
  const batchSetTextArea = async (app: any, list: any[]) => {
    const fields = list
      .filter((item) => !item.type)
      .map((item, i) => {
        return {
          // Name: item.label,
          Name: `${i}`,
          Range: { Start: item.range[0], End: item.range[1] },
          Value: `${item.value}`,
        };
      });

    console.log("添加公文域的个数：", fields.length);
    // for (let i = 0; i < fields.length; i++) {
    //   const item = fields[i];
    //   await addField(app, item.Name, item.Range[0], item.Range[1]);
    // }
    await app.ActiveDocument.DocumentFields.AddDocumentFields(fields.slice(0, 10));
    const count = await app.ActiveDocument.DocumentFields.Count;
    console.log("公文域个数", count);
  };
  const getAllTables = async (app: any) => {
    const tables = await app.ActiveDocument.Tables;
    // 获取页面中总表格数量
    // const count = await tables.Count;
    // const table1 = await tables.Item(1);
    return tables;
  };
  const getTableByIndex = async (tables: any, index: number) => {
    if (!tables) {
      return;
    }
    return await tables.Item(index);
  };
  // 替换表格文本
  const replaceTableCellText = (range: any, newText: string) => {
    range.Text = newText;
  };
  // useEffect(() => {
  //   console.log("----------------------", pageNum);
  //   try {
  //     // setFormItems(fieldList);
  //     setValues();
  //   } catch (error) {
  //     console.log("添加错误");
  //   }
  // }, [pageNum, app]);

  // 替换文本
  const replaceText = async (
    app: any,
    start: number,
    end: number,
    newText: string
  ) => {
    // 获取选中区域
    const range = await app.ActiveDocument.Range(start, end);
    range.Text = newText;
  };
  const setValues = () => {
    const values = {};
    fieldList.forEach((item) => {
      values[item.label] = item.value;
    });
    formObj.setFieldsValue(values);
  };
  // 获取文本
  const getTextByRange = async (app: any, start: number, end: number) => {
    const range = await app.ActiveDocument.Range(start, end);
    return range.Text;
  };
  const addField = async (
    app: any,
    name: string,
    start: number,
    end: number
  ) => {
    app.ActiveDocument.DocumentFields.Add({
      Name: name,
      Range: { Start: start, End: end },
      Hidden: false, // 是否隐藏，默认 false
      PrintOut: true, // 是否可打印，默认 true
      ReadOnly: true, // 是否只读，默认 false
    });
  };

  useEffect(() => {
    init(webOfficeConfig).catch((err) => {
      console.log("出现错误", err);
    });
  }, [fileId]);
  const handleSubmit = () => {
    const values = formObj.getFieldsValue();
    // 批量填充文字
    console.log("values", values);
    Object.keys(values).forEach(async (item) => {
      await updateDocumentField(item, values[item]);
    });
  };
  const handleRest = () => {
    formObj.resetFields();
    const values = formObj.getFieldsValue();
    Object.keys(values).forEach(async (item) => {
      await updateDocumentField(item, "");
    });
  };
  const FillTable = async (app: any) => {
    //获取表格
    const tables = await getAllTables(app);
    const table1 = await getTableByIndex(tables, 1);
    for (let i = 0; i < tableData.length; i++) {
      const tmp = tableData[i];
      for (let j = 0; j < tmp.length; j++) {
        let cell = await table1.Rows.Item(i + 2).Cells.Item(j + 1);
        const range = await cell.Range;
        replaceTableCellText(range, tableData[i][j]);
      }
    }
  };
  const handleTableSubmit = async () => {
    FillTable(app);
  };
  const addTextArea = async () => {
    batchSetTextArea(app, fieldList);
  };
  return (
    <div className={styles.container}>
      <div
        className={styles.webOfficeContainer}
        ref={webOfficeContainerRef}
      ></div>
      <FillForm
        FormItems={FormItems}
        formObj={formObj}
        onSubmit={handleSubmit}
        onReset={handleRest}
        isTable={isTable}
        onTableSubmit={handleTableSubmit}
        addTextArea={addTextArea}
      />
    </div>
  );
};
