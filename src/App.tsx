import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import NotFoundPage from "./pages/notfound";
import Login from "./pages/login";
import Facturas from "./pages/facturas/facturas";
import ProtectedRoute from "./layouts/ProtectedRoute";
import Factura from "./pages/facturas/factura";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Login/>} path="/login" />
      <Route element={<ProtectedRoute><Facturas/></ProtectedRoute>} path="/facturas" />
      <Route element={<ProtectedRoute><Factura/></ProtectedRoute>} path="/facturas/:id" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}

export default App;
