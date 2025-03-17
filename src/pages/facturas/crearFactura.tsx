import DefaultLayout from "@/layouts/default";
import { facturaSchema } from "@/types/factura";
import {
  Button,
  Divider,
  Input,
  DateInput,
  Select,
  SelectItem,
  Textarea,
  addToast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { crearFacturaType } from "@/types/factura";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/axios/apiClient";
import { parseDate } from "@internationalized/date";

export default function CrearFactura() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(facturaSchema) });

  // Obtener rangos de numeración para el Select
  const getNumberingRanges = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
      }
      const response = await apiClient.get("/v1/numbering-ranges", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.status == 401) {
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
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      console.log(error);
    }
  };

  const { data: numbering_ranges } = useQuery({
    queryKey: ["numeric_ranges"],
    queryFn: getNumberingRanges,
  });

  const onSubmit = (data: crearFacturaType) => {
    console.log(data);
  };

  return (
    <DefaultLayout>
      <h1 className="text-4xl font-bold">Crear factura</h1>
      <Divider className="my-4" />
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex mb-5">
            <div className="space-y-4 w-1/2 mx-4">
              <h2 className="text-2xl font-bold">Factura</h2>
              <Select
                {...register("numbering_range_id")}
                label="Rango de numeración"
                isRequired
                classNames={{
                  base: "dark",
                  popoverContent: "bg-gray-800 text-white",
                  trigger: "default-100 text-white border-gray-700",
                  value: "text-white",
                }}
              >
                {numbering_ranges?.data?.map((range: any) => (
                  <SelectItem className="dark" key={range.id}>
                    {range.document}
                  </SelectItem>
                ))}
              </Select>

              {errors?.numbering_range_id && (
                <span className="text-red-500">
                  {errors.numbering_range_id.message}
                </span>
              )}

              <Input
                {...register("reference_code")}
                label="Código de referencia"
                isRequired
              />

              <Textarea {...register("observation")} label="Observaciones" />

              <Select
                {...register("payment_form")}
                isRequired
                label="Forma de pago"
                classNames={{
                  base: "dark",
                  popoverContent: "bg-gray-800 text-white",
                  trigger: "default-100 text-white border-gray-700",
                  value: "text-white",
                }}
              >
                <SelectItem className="dark" key={"1"}>
                  Contado
                </SelectItem>
                <SelectItem className="dark" key={"2"}>
                  Crédito
                </SelectItem>
              </Select>

              <Controller
                name="payment_due_date"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <DateInput
                    label="Fecha de vencimiento"
                    value={field.value ? parseDate(field.value) : null}
                    onChange={(date) => field.onChange(date?.toString())}
                  />
                )}
              />
              <Select
                label="Método de pago"
                classNames={{
                  base: "dark",
                  popoverContent: "bg-gray-800 text-white",
                  trigger: "default-100 text-white border-gray-700",
                  value: "text-white",
                }}
                isRequired
                {...register("payment_method_code")}
              >
                <SelectItem key={"10"} className="dark">
                  Efectivo
                </SelectItem>
                <SelectItem key={"42"} className="dark">
                  Consignación
                </SelectItem>
                <SelectItem key={"47"} className="dark">
                  Transferencia
                </SelectItem>
                <SelectItem key={"49"} className="dark">
                  Tarjeta débito
                </SelectItem>
                <SelectItem key={"48"} className="dark">
                  Tarjeta crédito
                </SelectItem>
                <SelectItem key={"20"} className="dark">
                  Cheque
                </SelectItem>
                <SelectItem key={"71"} className="dark">
                  Bonos
                </SelectItem>
                <SelectItem key={"72"} className="dark">
                  Vales
                </SelectItem>
                <SelectItem key={"1"} className="dark">
                  Medio de pago no definido
                </SelectItem>
                <SelectItem key={"ZZZ"} className="dark">
                  Otro
                </SelectItem>
              </Select>
            </div>
            <div className="space-y-4 w-1/2 mx-4">
              <h2 className="text-2xl font-bold">Cliente</h2>
            </div>
          </div>
          <div className="flex justify-center">
            <Button color="success" variant="bordered" type="submit">
              Crear
            </Button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}
