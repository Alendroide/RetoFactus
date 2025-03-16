import apiClient from "@/axios/apiClient";
import FacturaContent from "@/components/facturaContent";
import DefaultLayout from "@/layouts/default";
import { addToast, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function Factura() {

  const fetchBill = async () => {
    try {

      const token = localStorage.getItem('token');
      if(!token){
        window.location.href = '/login'
      }
      const response = await apiClient.get(`/v1/bills/show/${id}`,{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error : any) {
      if(error.status === 401) {

        addToast({
          title: "Error",
          description: "Sesión expirada",
          color: "warning",
          classNames : {
              base : "dark"
          },
        })

        await new Promise((resolve) => {
          setTimeout(() => {
              console.log("Redirecting now...");
              resolve(1);
          }, 1500);
        });

        // Token expirado
        localStorage.removeItem('token');
        window.location.href = '/login'
      };
    }
  };

  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["bill", id],
    queryFn: fetchBill,
  })

  return (
    <DefaultLayout>
      <h1 className="text-4xl font-bold">Factura {id}</h1>
      <Divider className="my-4" />

      {isLoading && <h1 className="text-2xl font-bold my-6">Loading...</h1>}
      {isError && <h1 className="text-2xl font-bold my-6">Error</h1>}

      {data && (
        <FacturaContent data={data}/>
      )}

    </DefaultLayout>
  );
}
