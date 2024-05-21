import { createBrowserRouter } from "react-router-dom";
import WebOfficePage1 from "../pages/WebOfficePage1";
import Home from "../pages/Home";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/webOffice",
    element: <WebOfficePage1 />,
  },
]);
export default router;
