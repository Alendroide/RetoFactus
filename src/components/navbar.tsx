import { Link as BrandLink } from "react-router-dom";
import { Link } from "@heroui/link";
import { GithubIcon } from "./icons";
import { Button } from "@heroui/button";

export const Navbar = () => {

  const token = localStorage.getItem('token')

  return (
    <div className="px-10 py-2 flex justify-items-center align-middle shadow-md w-auto">
      
      {/* Logo */}
      <BrandLink to={"/"} className="flex">
        <img src="pepe.png" className="w-10 h-10 nav-logo" alt="" />
        <h3
          className="my-2 mx-4 nav-name"
          style={{
          color: "white", fontWeight: "500"
        }}>
          Pepe's bills
        </h3>
      </BrandLink>

      {/* Paginas */}

      <Link href={"/facturas"}>
        <h3
          className="my-2 mx-4 nav-link"
          style={{
          color: "white", fontWeight: "400"
        }}>
          Facturas
        </h3>
      </Link>

      <Link href={"/facturas/crear"}>
        <h3
          className="my-2 mx-4 nav-link"
          style={{
          color: "white", fontWeight: "400"
        }}>
          Crear factura
        </h3>
      </Link>

      <Link href={"/sobrenosotros"}>
        <h3
          className="my-2 mx-4 nav-link"
          style={{
          color: "white", fontWeight: "400"
        }}>
          Sobre nosotros
        </h3>
      </Link>

      <Link href={"https://github.com/Alendroide"} className="ms-auto flex nav-github" isExternal>
        <GithubIcon className="my-2 mx-4 text-white" fill="white" />
        <p className="my-2 text-white">GitHub</p>
      </Link>

      {token && (
        <Button onPress={() => {localStorage.removeItem('token'); window.location.href = '/login'}} variant="bordered" color="danger" className="mx-4">
            Logout
        </Button>
      )}
    </div>
  );
};
