
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Card, CardBody } from "@heroui/card";
import { CheckCircle, Download, Search } from "lucide-react";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center text-center py-16 px-4 space-y-12">

      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold">Gestiona tus facturas electrónicas con facilidad</h1>
        <p className="text-lg text-gray-400">
          Con <span className="font-semibold">Pepe's Bills</span>, puedes crear, buscar y descargar tus facturas electrónicas de manera rápida y segura.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/login">
            <Button color="primary" variant="bordered" className="px-6 py-3 text-lg">Empezar ahora</Button>
          </Link>
          <Link href="/sobrenosotros">
            <Button color="primary" variant="bordered" className="px-6 py-3 text-lg">Más información</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        
        <Card className="bg-gray-900">
          <CardBody className="flex flex-col items-center text-center p-6 space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-200">Crea facturas fácilmente</h3>
            <p className="text-gray-300">Genera facturas electrónicas en pocos pasos con nuestra interfaz intuitiva.</p>
          </CardBody>
        </Card>

        <Card className="bg-gray-900">
          <CardBody className="flex flex-col items-center text-center p-6 space-y-4">
            <Search className="w-12 h-12 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-200">Búsqueda rápida</h3>
            <p className="text-gray-300">Encuentra cualquier factura en segundos gracias a nuestro potente buscador.</p>
          </CardBody>
        </Card>

        <Card className="bg-gray-900">
          <CardBody className="flex flex-col items-center text-center p-6 space-y-4">
            <Download className="w-12 h-12 text-purple-500" />
            <h3 className="text-xl font-semibold text-gray-200">Descarga en un clic</h3>
            <p className="text-gray-300">Descarga tus facturas en PDF con un solo clic, de forma rápida y segura.</p>
          </CardBody>
        </Card>

      </div>
    </div>
    </DefaultLayout>
  );
}
