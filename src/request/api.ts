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
  const md5Hash = CryptoJS.MD5(data);
  return md5Hash;
};

const getFileList = async () => {
  return await req.get("files");
};
// 格式转换
export const pdf2Docx = async () => {
  const body = {
    url: `http://47.101.175.221:3000/pdf/tested.pdf`,
    filename:'测试.pdf',
  }

  const md5 = generateMd5HashStr(JSON.stringify(body))
    .toString(CryptoJS.enc.Hex)
    .toLowerCase();
  const dateStr = formatTime();
  return await req.post(
    "http://47.101.175.221:3000/pdf2docx",
    {
      ...body
    }
  );
};
