import React, {
  useEffect,
  useRef,
  EventHandler,
  useState,
  useLayoutEffect,
} from "react";
// import WebOfficeSDK from "../../webOfficeSdk";
import styles from "./index.module.scss";
import * as docx from "docx";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun } from "docx";
import FileInput from "./FileInput";
import FillForm from "./FillForm";
const webOfficeConfig = {
  appId: "SX20240507FLZJFO",
  officeType: WebOfficeSDK.OfficeType.Writer,
  fileId: "716d35b9ad6e4875a1e786663bc346f5",
  token: "1",
};

const getTextByContext = async (context: string) => {
  const { data } = await axios.get("http://localhost:3001/getInputText");
  return data;
};

const WebOfficePage = () => {
  const ref = React.createRef<any>();
  const [app, setApp] = useState<any>(null);
  const [instance, setInstance] = useState<any>(null);

  // 初始化sdk
  const init = async (config: any = {}) => {
    if (instance) {
      instance.destroy();
    }
    const inst = WebOfficeSDK.init({
      ...config,
      mount: ref?.current,
    });
    setInstance(inst);
    await inst.ready();
    inst.ApiEvent.AddApiEventListener("WindowSelectionChange", async (data) => {
      const { begin, end } = data;
      if (begin == end) {
        return;
      }
      setSelectArea(inst?.Application, begin, end);
      const contextText = await getTextByRange(
        inst?.Application,
        begin - 20,
        end
      );

      console.log("contextText", contextText.split(""));
      setFocus(inst?.Application, false);
      // const text: string = await getTextByContext("2321");

      // replaceText(inst?.Application, begin, end, text);
    });
    setApp(inst?.Application);
    // app.ActiveDocument.DocumentFields.Add({
    //   Name: "1",
    //   Range: { Start: 1, End: 20 },
    //   Hidden: false, // 是否隐藏，默认 false
    //   PrintOut: true, // 是否可打印，默认 true
    //   ReadOnly: true, // 是否只读，默认 false
    // });
    // const range = await app.ActiveDocument.Range(0, 1000).Text;
    // await app.ActiveDocument.Find.Execute("_", true);
    // console.log("range text", { range });

    // 获取指定区域的带格式 HTML 数据
    // const htmlInfo = await range.GetHtmlData();
    // console.log("htmlInfo-----", htmlInfo);

    // 在光标处插入内容控件

    // const count = await app.ActiveDocument.DocumentFields.Count;
    // console.log("公文域的个数", count);
  };

  useEffect(() => {
    getTextByContext("3213");
    init(webOfficeConfig).catch((err) => {
      console.log("出现错误", err);
    });
  }, []);

  const [form, setForm] = useState([
    {
      label: "注册地",
      name: "aName",
    },
    {
      label: "法人",
      name: "bName",
    },
  ]);
  const [values, setValues] = useState({
    aName: "",
    bName: "",
  });
  // 通过添加公文域设置的name值获取对应的区域，设置值
  async function updateDocumentField(name: string, value: any) {
    // 公文域集合的单个公文域
    const documentField = await app.ActiveDocument.DocumentFields.Item({
      Name: name,
    });
    // 设置公文域的值
    documentField.Value = value;
  }

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
  // 获取文本
  const getTextByRange = async (app: any, start: number, end: number) => {
    const range = await app.ActiveDocument.Range(start, end);
    return range.Text;
  };
  // 提交表单 - 填充数据
  async function onSubmit(values: any) {
    await app.ActiveDocument.Unprotect("");
    await updateDocumentField("1", values.aName);
    await updateDocumentField("2", values.bName);
    // await updateDocumentField('3', values.aAddress)
    // await updateDocumentField('4', values.bAddress)
    await app.ActiveDocument.Protect("");
  }
  // 设置光标焦点
  const setFocus = async (app: any, foucs: boolean) => {
    const editor = await app.ActiveOutline.Editor;
    const doc = await editor.Document;
    const selection = await doc.Selection;

    // 设置编辑器失焦
    await selection.SetEditorFocus({
      Focus: foucs,
    });
  };

  useEffect(() => {
    return () => {
      instance.destroy();
    };
  }, []);
  const getIframe = () => {
    const iframe = document.querySelector("#office-iframe-1"); // 通过id获取iframe
    console.log(iframe);
    // const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // iframeDoc?.addEventListener("click", function (event) {
    //   alert("Clicked inside iframe");
    // });
  };
  const addContentControl = async (app: any) => {
    // 内容控件对象
    const contentControls = await app.ActiveDocument.ContentControls;
    // 在光标处插入内容控件
    await contentControls.Add({});
  };
  return (
    <div
      className={styles.container}
      onClick={() => {
        console.log("鼠标点击-------");
      }}
    >
      {/* <div className={styles.left}>
        <FileInput onChange={handleChange}></FileInput>
      </div>
      <div className={styles.right} id="officeOutput"></div> */}
      {/* <FillForm
        data={form}
        onSubmit={onSubmit}
        values={values}
        valuesChange={(name: string, value: string) => {
          let newValues = {
            ...values,
          };
          newValues[name] = value;
          setValues(newValues);
        }}
      ></FillForm> */}
    </div>
  );
};

export default WebOfficePage;
