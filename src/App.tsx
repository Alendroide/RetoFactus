import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import NotFoundPage from "./pages/notfound";
import Login from "./pages/login";
import Facturas from "./pages/facturas";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Login/>} path="/login" />
      <Route element={<Facturas/>} path="/facturas" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}

export default App;
