import apiClient from "@/axios/apiClient";
import FacturaContent from "@/components/facturaContent";
import DefaultLayout from "@/layouts/default";
import { addToast, Button, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
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

  const downloadPDF = async() => {
    try{
      addToast({
        title: "Descargando factura",
        description: "Espere un momento",
        color: "success",
        classNames : {
            base : "dark"
        },
      })
      const token = localStorage.getItem('token');
      if(!token){
        window.location.href = '/login'
      }
      const response = await apiClient.get(`/v1/bills/download-pdf/${id}`,{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const pdfBase64 = response.data.data.pdf_base_64_encoded;
      const pdfConverted = atob(pdfBase64);
      const pdfArray = new Uint8Array(pdfConverted.length);
      for(let i = 0; i < pdfConverted.length; i++) {
        pdfArray[i] = pdfConverted.charCodeAt(i);
      }
      // Crear BLOB
      const blob = new Blob([pdfArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Crear link del blob
      const link = document.createElement("a");
      link.href = url;
      link.download = `factura-${id}.pdf`;
      link.click();

      URL.revokeObjectURL(url);
    }
    catch(error : any) {
      console.log(error);
      addToast({
        title: "Error",
        description: "Error al descargar factura",
        color: "warning",
        classNames : {
            base : "dark"
        },
      })
    }
  }

  const downloadXML = async() => {
    try{
      addToast({
        title: "Descargando factura",
        description: "Espere un momento",
        color: "success",
        classNames : {
            base : "dark"
        },
      })
      const token = localStorage.getItem('token');
      if(!token){
        window.location.href = '/login'
      }
      const response = await apiClient.get(`/v1/bills/download-xml/${id}`,{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const xmlBase64 = response.data.data.xml_base_64_encoded;
      const xmlConverted = atob(xmlBase64);
      const xmlArray = new Uint8Array(xmlConverted.length);
      for(let i = 0; i < xmlConverted.length; i++) {
        xmlArray[i] = xmlConverted.charCodeAt(i);
      }
      // Crear BLOB
      const blob = new Blob([xmlArray], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);

      // Crear link del blob
      const link = document.createElement("a");
      link.href = url;
      link.download = `factura-${id}.xml`;
      link.click();

      URL.revokeObjectURL(url);
    }
    catch(error : any) {
      console.log(error);
      addToast({
        title: "Error",
        description: "Error al descargar factura",
        color: "warning",
        classNames : {
            base : "dark"
        },
      })
    }
  }

  return (
    <DefaultLayout>
      <h1 className="text-4xl font-bold">Factura {id}</h1>
      <Divider className="my-4" />

      {isLoading && <h1 className="text-2xl font-bold my-6">Loading...</h1>}
      {isError && <h1 className="text-2xl font-bold my-6">Error</h1>}

      {data && (
        <div className="flex w-11/12">
          <div className="w-3/4">
            <FacturaContent data={data}/>
          </div>
          <div>
            <div className="flex align-middle mb-5">

              <p className="my-auto ms-5 font-semibold">DESCARGAR COMO PDF:</p>

              <Button color="danger" variant="bordered" className="ml-4 flex justify-center" onPress={() => downloadPDF()}>
                  <Download className="w-5 h-5 danger" />
              </Button>

            </div>

            <div className="flex align-middle mb-5">
              <p className="my-auto ms-5 font-semibold">DESCARGAR COMO XML:</p>

              <Button color="success" variant="bordered" className="ml-4 flex justify-center" onPress={() => downloadXML()}>
                  <Download className="w-5 h-5 success" />
              </Button>
            </div>
          </div>
        </div>
      )}

    </DefaultLayout>
  );
}
