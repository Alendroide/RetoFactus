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
  TimeInput,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { crearFacturaType } from "@/types/factura";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/axios/apiClient";
import { parseDate, parseTime } from "@internationalized/date";

export default function CrearFactura() {
  const {
    watch,
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
              
              <Divider className="my-4"/>

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

              {errors?.reference_code && (
                <span className="text-red-500">
                  {errors.reference_code.message}
                </span>
              )}

              <Textarea {...register("observation")} label="Observaciones" />

              {errors?.observation && (
                <span className="text-red-500">
                  {errors.observation.message}
                </span>
              )}

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

              {errors?.payment_form && (
                <span className="text-red-500">
                  {errors.payment_form.message}
                </span>
              )}

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

              {errors?.payment_due_date && (
                <span className="text-red-500">
                  {errors.payment_due_date.message}
                </span>
              )}

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

              {errors?.payment_method_code && (
                <span className="text-red-500">
                  {errors.payment_method_code.message}
                </span>
              )}

              <h2 className="font-semibold">
                Periodo de facturación
              </h2>

              <Divider className="my-4"/>

              <Controller
                name="billing_period.start_date"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <DateInput
                    label="Inicio periodo de facturación"
                    value={field.value ? parseDate(field.value) : null}
                    onChange={(date) => field.onChange(date?.toString())}
                  />
                )}
              />
              
              {errors?.billing_period?.start_date && (
                <span className="text-red-500">
                  {errors.billing_period.start_date.message}
                </span>
              )}

              <Controller
                name="billing_period.start_time"
                control={control}
                defaultValue=""
                render={({field}) => (
                  <TimeInput
                    label="Hora de inicio"
                    value={field.value ? parseTime(field.value) : null} 
                    onChange={(time) => field.onChange(time?.toString())}
                  />
                )}
              />

              {errors?.billing_period?.start_time && (
                <span className="text-red-500">
                  {errors.billing_period.start_time.message}
                </span>
              )}

              <Controller
                name="billing_period.end_date"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <DateInput
                    label="Finalización periodo de facturación"
                    value={field.value ? parseDate(field.value) : null}
                    onChange={(date) => field.onChange(date?.toString())}
                  />
                )}
              />

              {errors?.billing_period?.end_date && (
                <span className="text-red-500">
                  {errors.billing_period.end_date.message}
                </span>
              )}

              <Controller
                name="billing_period.end_time"
                control={control}
                defaultValue=""
                render={({field}) => (
                  <TimeInput
                    label="Hora de finalización"
                    value={field.value ? parseTime(field.value) : null} 
                    onChange={(time) => field.onChange(time?.toString())}
                  />
                )}
              />

              {errors?.billing_period?.end_time && (
                <span className="text-red-500">
                  {errors.billing_period.end_time.message}
                </span>
              )}

            </div>
            <div className="space-y-4 w-1/2 mx-4">
              <h2 className="text-2xl font-bold">Cliente</h2>

              <Divider className="my-4"/>

              <Input
                {...register("customer.identification")}
                type="number"
                label="Identificación"
                isRequired
              />

              {errors?.customer?.identification && (
                <span className="text-red-500">
                  {errors.customer.identification.message}
                </span>
              )}

              <Input
                {...register("customer.dv")}
                type="number"
                label="Digito de verificación"
              />

              {errors?.customer?.dv && (
                <span className="text-red-500">
                  {errors.customer.dv.message}
                </span>
              )}

              <Input
                {...register("customer.company")}
                label="Compañía"
              />

              {errors?.customer?.company && (
                <span className="text-red-500">
                  {errors.customer.company.message}
                </span>
              )}

              <Input
                {...register("customer.trade_name")}
                label="Nombre comercial"
              />

              {errors?.customer?.trade_name && (
                <span className="text-red-500">
                  {errors.customer.trade_name.message}
                </span>
              )}

              <Input
                {...register("customer.names")}
                label="Nombre(s)"
                isRequired
              />

              {errors?.customer?.names && (
                <span className="text-red-500">
                  {errors.customer.names.message}
                </span>
              )}

              <Input
                {...register("customer.address")}
                label="Dirección"
                isRequired
              />

              {errors?.customer?.address && (
                <span className="text-red-500">
                  {errors.customer.address.message}
                </span>
              )}

              <Input
                {...register("customer.email")}
                label="E-Mail"
                isRequired
                type="email"
              />

              {errors?.customer?.email && (
                <span className="text-red-500">
                  {errors.customer.email.message}
                </span>
              )}

              <Input
                {...register("customer.phone")}
                label="Telefono"
                isRequired
                type="number"
              />

              {errors?.customer?.phone && (
                <span className="text-red-500">
                  {errors.customer.phone.message}
                </span>
              )}

              <Input
                {...register("customer.email")}
                label="E-Mail"
                isRequired
                type="email"
              />

              {errors?.customer?.email && (
                <span className="text-red-500">
                  {errors.customer.email.message}
                </span>
              )}

              <Select
                {...register("customer.legal_organization_id")}
                label="Organización legal"
                isRequired
              >
                <SelectItem key={"1"}>Persona jurídica</SelectItem>
                <SelectItem key={"2"}>Persona natural</SelectItem>
              </Select>

              {errors?.customer?.legal_organization_id && (
                <span className="text-red-500">
                  {errors.customer.legal_organization_id.message}
                </span>
              )}

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
