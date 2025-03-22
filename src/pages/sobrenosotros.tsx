import DefaultLayout from "@/layouts/default";
import { Card, CardBody } from "@heroui/card";
import { Atom, Mail, User, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export default function SobreNosotros() {
  return (
    <DefaultLayout>
      <div className="w-1/2 mx-auto bg-gray-900 p-12 rounded-2xl">
        <User className="text-blue-500 w-28 h-28 mx-auto my-4" />
        <h1 className="text-4xl font-bold text-center">¡Sobre nosotros!</h1>
        <div className="space-y-4 my-4">
          <p>
            Soy un estudiante de Análisis y Desarrollo de Software{" "}
            <span className="text-primary-500">(ADSO)</span> del Servicio
            Nacional de Aprendizaje{" "}
            <span className="text-success-300">
              <Link to={"https://www.sena.edu.co"}>SENA</Link>
            </span>.
          </p>
          <p>
            Apasionado por la tecnología y el desarrollo de software, trabajo
            con diversas tecnologías para crear soluciones innovadoras.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 space-x-12 w-2/3 mx-auto my-14">
        <Card className="bg-gray-900">
          <CardBody className="text-center">
            <Atom className="w-12 h-12 mx-auto mt-3 text-blue-500" />
            <h1 className="text-xl font-bold mt-2">ReactJS</h1>
            <p className="text-gray-400 mt-2">
              Utilizo ReactJS para construir interfaces de usuario dinámicas y
              eficientes, aprovechando su ecosistema de componentes reutilizables.
            </p>
          </CardBody>
        </Card>
        <Card className="bg-gray-900">
          <CardBody className="text-center">
            <LayoutDashboard className="w-12 h-12 mx-auto mt-3 text-purple-500" />
            <h1 className="text-xl font-bold mt-2">HeroUI</h1>
            <p className="text-gray-400 mt-2">
              Diseño interfaces atractivas y modernas con HeroUI, una biblioteca
              de componentes que facilita la construcción de aplicaciones elegantes.
            </p>
          </CardBody>
        </Card>
      </div>

      <h3 className="text-center text-2xl font-bold mb-8">Contacto</h3>

      <div className="w-2/3 mx-auto mb-8">
        <Card className="bg-gray-900">
            <CardBody className="text-center">
              <Mail className="w-12 h-12 mx-auto mt-3 text-green-500" />
              <h1 className="text-xl font-bold mt-2">alejandrobonillaecheverri@gmail.com</h1>
              <p className="text-gray-400 mt-2 w-1/2 mx-auto">
                E-mail profesional para consultas profesionales, contáctame para cualquier necesidad en Software
                
              </p>
            </CardBody>
          </Card>
      </div>
    </DefaultLayout>
  );
}
