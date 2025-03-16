import { Card, CardBody } from "@heroui/card";

export default function FacturaContent({ data: bill }: any) {
  return (
    <Card className="w-3/4 light">
      <CardBody>
        <div className="w-11/12 m-auto">

          {/* Encabezado */}
          <div className="flex items-center align-middle my-6 text-center relative">

            {/* Logo de la empresa */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <img
                className="w-1/4"
                src={bill.data.company.url_logo}
                alt="CompanyLogo"
              />
            </div>

            {/* Datos de la empresa */}
            <div className="mx-auto">
              <div className="mb-4">
                <p className="text-xl font-bold">
                  {bill.data.bill.document.name.toUpperCase()}
                </p>
                <p className="text-xl font-bold">
                  NUMERO {bill.data.bill.number}
                </p>
              </div>

              <p className="font-semibold">{bill.data.company.company}</p>
              <p>
                NIT:{bill.data.company.nit}-{bill.data.company.dv}
              </p>
              <p>{bill.data.company.direction}</p>
              <p>{bill.data.company.phone}</p>
            </div>

            {/* QR */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-red-700">
              <img
                className="w-36 h-36"
                src={bill.data.bill.qr_image}
                alt="CompanyLogo"
              />
            </div>

          </div>

          <div className="flex text-xs">
            <div className="grid grid-cols-[2fr_6fr] w-3/5 me-2 bg-gray-300">
                <div className="grid grid-rows-5 font-semibold p-2">
                    <div>CC/NIT:</div>
                    <div>Cliente:</div>
                    <div>Dirección:</div>
                    <div>Municipio:</div>
                    <div>Email:</div>
                </div>
                <div className="grid grid-rows-5 p-1 gap-1">
                    <div className="bg-white p-0.5">
                        {bill.data.customer.identification ?? ""}
                    </div>
                    <div className="bg-white p-0.5">
                        {bill.data.customer.names ?? ""}
                    </div>
                    <div className="bg-white p-0.5">
                        {bill.data.customer.address ?? ""}
                    </div>
                    <div className="bg-white p-0.5">
                        {bill.data.customer.municipality.name ?? ""}
                    </div>
                    <div className="bg-white p-0.5">
                        {bill.data.customer.email ?? ""}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 w-2/5 bg-gray-300 mb-auto">
                <div className="grid grid-rows-2 font-semibold p-2">
                    <div>Fecha generación:</div>
                    <div>Fecha de validación:</div>
                </div>
                <div className="grid grid-rows-2 p-1 gap-1">
                    <div className="bg-white p-0.5">
                        {bill.data.bill.created_at ?? ""}
                    </div>
                    <div className="bg-white p-0.5">
                        {bill.data.bill.validated ?? ""}
                    </div>
                </div>
            </div>
            
          </div>

          <table className="my-8 table-fixed w-full border-collapse border text-xs">
            <thead>
                <tr className="text-center">
                    <th className="border p-2 font-semibold w-8">#</th>
                    <th className="border p-2 font-semibold w-16">Código</th>
                    <th className="border p-2 font-semibold w-32">Descripción</th>
                    <th className="border p-2 font-semibold w-12">Cantidad</th>
                    <th className="border p-2 font-semibold w-20">Val. Unit</th>
                    <th className="border p-2 font-semibold w-16">Descuento</th>
                    <th className="border p-2 font-semibold w-12">IVA</th>
                    <th className="border p-2 font-semibold w-12">INC</th>
                    <th className="border p-2 font-semibold w-20">Val. Item</th>
                </tr>
            </thead>

            <tbody>
                {bill.data.items.map((item: any, index: number) => (
                    <tr className="text-center">
                        <td className="border p-2">{index+1}</td>
                        <td className="border p-2">{parseInt(item.code_reference)}</td>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">{item.quantity}</td>
                        <td className="border p-2">{item.price}</td>
                        <td className="border p-2">{item.discount}</td>
                        <td className="border p-2"></td>
                        <td className="border p-2">{item.tax_rate}%</td>
                        <td className="border p-2">{item.taxable_amount}</td>
                    </tr>
                ))}
            </tbody>

          </table>
          
          {/* Observaciones */}
          <table className="my-8 table-fixed w-full border-collapse border text-xs">
                <thead className="text-center">
                    <tr>
                        <th className="border w-2/3">Observaciones</th>
                        <th className="border w-1/3">Totales</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="flex"><p className="mb-auto">{bill.data.bill.observation ?? ""}</p></td>
                        <td className="border p-2">
                            <table className="table-fixed w-full border-collapse border text-xs">
                                <thead className="text-center">
                                    <tr>
                                        <th className="border p-2">Concepto</th>
                                        <th className="border p-2">Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2">Nro Líneas:</td>
                                        <td className="border p-2 text-center">{bill.data.items.length}</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Valor bruto:</td>
                                        <td className="border p-2 text-center">${bill.data.bill.gross_value}</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Base imponible:</td>
                                        <td className="border p-2 text-center">${bill.data.bill.taxable_amount}</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Impuestos:</td>
                                        <td className="border p-2 text-center">${bill.data.bill.tax_amount}</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Descuentos:</td>
                                        <td className="border p-2 text-center">${bill.data.bill.discount}</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Total:</td>
                                        <td className="border p-2 text-center">${bill.data.bill.total}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
