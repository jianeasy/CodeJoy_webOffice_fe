import req from ".";
import dayjs from "dayjs";
import CryptoJS from "crypto-js";

// 格式转换 appkey =  RtjfrMXCnCRISNwTcgnMzIfeHsYUjfNX
const formatTime = () => {
  const rfc1123Format = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
  const formattedDate = dayjs().format(rfc1123Format);
  return formattedDate;
};
const generateMd5HashStr = (data: any) => {
  const md5Hash = CryptoJS(data);
  return md5Hash;
};

const getFileList = async () => {
  return await req.get("files");
};
// 格式转换
const pdf2Docx = async (params: { fileId: any; version: any }) => {
  const { fileId, version } = params;
  const body = {
    url: `/download/${fileId}/${version}`,
  };

  const md5 = generateMd5HashStr(JSON.stringify(body))
    .toString(CryptoJS.enc.Hex)
    .toLowerCase();
  const dateStr = formatTime();
  return await req.post(
    "https://solution.wps.cn/api/developer/v1/office/pdf/convert/to/docx",
    {
      url: `/download/${fileId}/${version}`, //文档下载地
    },
    {
      headers: {
        Date: dateStr,
        "Content-Md5": md5,
        "Content-Type": "application/json",
        Authorization:
          "WPS-2:" +
          "SX20240507FLZJFO" +
          ":" +
          CryptoJS.SHA1(
            "RtjfrMXCnCRISNwTcgnMzIfeHsYUjfNX" +
              md5 +
              "application/json" +
              dateStr
          ),
      },
    }
  );
};
