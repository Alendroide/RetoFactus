import DefaultLayout from "@/layouts/default";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/axios/apiClient";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "react-router-dom";
import { Divider, Pagination, Select, SelectItem } from "@heroui/react";

export default function Facturas() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    identification: "",
    names: "",
    number: "",
    prefix: "",
    reference_code: "",
    status: "",
  });

  const fetchBills = async () => {
    try {
      // Sólo incluya filtros que tienen un valor (no cadena vacia o indefinido)
      const activeFilters = Object.entries(filters).reduce(
        (acc: any, [key, value]) => {
          if (value && value.trim() !== "") {
            acc[`filter[${key}]`] = value;
          }
          return acc;
        },
        {}
      );

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
      }

      const response = await apiClient.get(`/v1/bills?page=${page}`, {
        params: activeFilters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTotalPages(response.data.data.pagination.total);

      return response.data;
    } catch (error: any) {
      if (error.status === 401) {
        addToast({
          title: "Error",
          description: "Sesión expirada",
          color: "warning",
          classNames: {
            base: "dark",
          },
        });

        await new Promise((resolve) => {
          setTimeout(() => {
            console.log("Redirecting now...");
            resolve(1);
          }, 1500);
        });

        // Token expirado
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      addToast({
        title: "Error",
        description: "Error al obtener las facturas",
        color: "danger",
        classNames: {
          base: "dark",
        },
      });
    }
  };

  // Cambio en algún input
  const handleInputChange = (e: any) => {
    setPage(1);
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {
    data: bills,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bills", filters, page],
    queryFn: fetchBills,
  });

  return (
    <DefaultLayout>
      <h1 className="text-4xl font-bold">Facturas</h1>
      <Divider className="my-4" />

      <div className="flex space-x-4">
        <div className="w-1/4 space-y-4">
          <h1 className="text-2xl text-center">Filtrar</h1>
          <Input
            name="identification"
            value={filters.identification}
            onChange={handleInputChange}
            placeholder="Identificacion"
          />
          <Input
            name="names"
            value={filters.names}
            onChange={handleInputChange}
            placeholder="Nombres"
          />
          <Input
            name="number"
            value={filters.number}
            onChange={handleInputChange}
            placeholder="Numero"
          />
          <Input
            name="prefix"
            value={filters.prefix}
            onChange={handleInputChange}
            placeholder="Prefijo"
          />
          <Input
            name="reference_code"
            value={filters.reference_code}
            onChange={handleInputChange}
            placeholder="Codigo de referencia"
          />

          <Select
            label="Estado"
            name="status"
            value={filters.status}
            onChange={handleInputChange}
            placeholder="Estado"
            classNames={{
              base: "dark",
              popoverContent: "bg-gray-800 text-white",
              trigger: "default-100 text-white border-gray-700",
              value: "text-white",
            }}
          >
            <SelectItem className="dark" key={""}>
              Todos
            </SelectItem>
            <SelectItem className="dark" key={"1"}>
              Validado
            </SelectItem>
            <SelectItem className="dark" key={"0"}>
              No validado
            </SelectItem>
          </Select>
        </div>

        <div className="w-3/4 space-y-4">
          <h1 className="text-2xl">Resultados</h1>

          <div className="flex space-x-4">
            <Pagination
              page={page}
              initialPage={1}
              total={totalPages}
              showControls
              onChange={(page) => setPage(page)}
            />
          </div>

          {isLoading && <p className="text-lg">Cargando...</p>}
          {isError && <p>Error</p>}

          {bills?.data?.data &&
            bills.data.data.map((bill: any) => (
              <div key={bill.id}>
                <Link to={`/facturas/${bill.number}`}>
                  <Card className="bg-gray-900 fac-card">
                    <CardHeader>
                      <div className="flex">
                        <h1 className="text-xl font-semibold text-gray-200">
                          {bill.document.name} - {bill.number}
                        </h1>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="">
                      <div className="flex">
                        <div className="w-1/2">
                          <h1 className="text-lg font-bold">Cliente</h1>
                          <div className="flex">
                            <b>Nombres:</b>{" "}
                            <p className="ms-auto me-10">{bill.names}</p>
                          </div>
                          <div className="flex">
                            <b>CC:</b>{" "}
                            <p className="ms-auto me-10">
                              {bill.identification}
                            </p>
                          </div>
                          <div className="flex">
                            <b>Email:</b>{" "}
                            <p className="ms-auto me-10">{bill.email}</p>
                          </div>
                        </div>
                        <div className="w-1/2">
                          <h1 className="text-lg font-bold">Método de pago</h1>
                          {bill.payment_form.name}
                          <Divider className="my-4" />
                          <h1 className="text-lg font-bold">
                            Código de referencia
                          </h1>
                          <p>{bill.reference_code}</p>
                        </div>
                      </div>
                      <Divider className="my-4" />
                      <div className="flex">
                        <h1 className="text-lg font-bold">Total:</h1>
                        <p className="ms-auto me-10">${bill.total}</p>
                      </div>
                      <div className="flex">
                        <h1 className="text-lg font-bold">Fecha:</h1>
                        <p className="ms-auto me-10">
                          {bill.created_at ? bill.created_at : "No disponible"}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </DefaultLayout>
  );
}
