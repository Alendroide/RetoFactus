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
  Checkbox,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { crearFacturaType } from "@/types/factura";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/axios/apiClient";
import { parseDate, parseTime } from "@internationalized/date";

export default function CrearFactura() {
  const {
    setValue,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(facturaSchema),
    defaultValues: {
      items: [{ code_reference: "", name: "", quantity: 1, price: 0, tax_rate: "", unit_measure_id: 1, standard_code_id: 0, is_excluded: 0, tribute_id: 0, withholding_taxes: [] }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

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

  const getMunicipalities = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
      }
      const response = await apiClient.get("/v1/municipalities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
    catch (error: any) {
      console.log(error);
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
    }
  }

  const getUnitMeasures = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
      }
      const response = await apiClient.get("/v1/measurement-units", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
    catch (error: any) {
      console.log(error);
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
    }
  }

  const getTributes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
      }
      const response = await apiClient.get("/v1/tributes/products?name=", {
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

  const { data: municipalities } = useQuery({
    queryKey: ["municipalities"],
    queryFn: getMunicipalities
  })

  const { data: unit_measures } = useQuery({
    queryKey: ["unit_measures"],
    queryFn: getUnitMeasures,
  });

  const { data: tributes } = useQuery({
    queryKey: ["tributes"],
    queryFn: getTributes,
  });

  const onSubmit = async (data: crearFacturaType) => {
    try {
      addToast({
        title: "Creando factura...",
        description: "Espere mientras se crea su factura",
        color: "primary",
        promise: new Promise((resolve) => setTimeout(resolve, 3000)),
        classNames: {
          base: "dark"
        }
      })
      const result = await apiClient.post('v1/bills/validate', {
        ...data
      })
      const number = result.data.data.bill.number;
      window.location.href = `/facturas/${number}`;
    }
    catch (error: any) {
      console.log(error);
      addToast({
        title: "Error",
        description: "No se pudo crear la factura",
        color: "danger",
        classNames: {
          base: "dark"
        }
      })
    }
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

              <Divider className="my-4" />

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

              <Divider className="my-4" />

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
                render={({ field }) => (
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
                render={({ field }) => (
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

              <Divider className="my-4" />

              <div className="grid grid-cols-[1fr_2fr]">
                <Select
                  {...register("customer.identification_document_id")}
                  label="Tipo identificación"
                  isRequired
                  classNames={{
                    base: "dark",
                    popoverContent: "bg-gray-800 text-white",
                    trigger: "default-100 text-white border-gray-700",
                    value: "text-white",
                  }}
                >
                  <SelectItem className="dark" key={"1"}>Registro civil</SelectItem>
                  <SelectItem className="dark" key={"2"}>Tarjeta de identidad</SelectItem>
                  <SelectItem className="dark" key={"3"}>Cédula de ciudadanía</SelectItem>
                  <SelectItem className="dark" key={"4"}>Tarjeta de extranjería</SelectItem>
                  <SelectItem className="dark" key={"5"}>Cédula de extranjería</SelectItem>
                  <SelectItem className="dark" key={"6"}>NIT</SelectItem>
                  <SelectItem className="dark" key={"7"}>Pasaporte</SelectItem>
                  <SelectItem className="dark" key={"8"}>ID extranjero</SelectItem>
                  <SelectItem className="dark" key={"9"}>PEP</SelectItem>
                  <SelectItem className="dark" key={"10"}>NIT Otro país</SelectItem>
                  <SelectItem className="dark" key={"11"}>NUIP*</SelectItem>
                </Select>


                <Input
                  {...register("customer.identification")}
                  type="number"
                  label="Identificación"
                  isRequired
                />
              </div>
              <p>
                {errors?.customer?.identification_document_id && (
                  <p className="text-red-500">{errors.customer.identification_document_id.message}</p>
                )}
              </p>
              <p>
                {errors?.customer?.identification && (
                  <p className="text-red-500">{errors.customer.identification.message}</p>
                )}
              </p>

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

              <Controller
                control={control}
                name="customer.municipality_id"
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    label="Municipio"
                    classNames={{
                      base: "dark",
                      popoverContent: "bg-gray-800 text-white",
                    }}
                    onSelectionChange={(key) => field.onChange(key)}
                    selectedKey={field.value}
                  >
                    {municipalities?.data?.map((municipality: any) => (
                      <AutocompleteItem className="dark" key={`${municipality.id}`}>{`${municipality.department} - ${municipality.name}`}</AutocompleteItem>
                    ))}
                  </Autocomplete>
                )}
              />

              {errors?.customer?.municipality_id && (
                <p className="text-red-500">{errors.customer.municipality_id.message}</p>
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

              <Select
                {...register("customer.legal_organization_id")}
                label="Organización legal"
                isRequired
                classNames={{
                  base: "dark",
                  popoverContent: "bg-gray-800 text-white",
                  trigger: "default-100 text-white border-gray-700",
                  value: "text-white",
                }}
              >
                <SelectItem className="dark" key={"1"}>Persona jurídica</SelectItem>
                <SelectItem className="dark" key={"2"}>Persona natural</SelectItem>
              </Select>

              {errors?.customer?.legal_organization_id && (
                <span className="text-red-500">
                  {errors.customer.legal_organization_id.message}
                </span>
              )}

              <Select
                {...register("customer.tribute_id")}
                label="Tributos cliente"
                isRequired
                classNames={{
                  base: "dark",
                  popoverContent: "bg-gray-800 text-white",
                  trigger: "default-100 text-white border-gray-700",
                  value: "text-white",
                }}
              >
                <SelectItem className="dark" key={"21"}>No aplica *</SelectItem>
                <SelectItem className="dark" key={"18"}>IVA</SelectItem>
              </Select>

              {errors?.customer?.tribute_id && (
                <span className="text-red-500">
                  {errors.customer.tribute_id.message}
                </span>
              )}

            </div>
          </div>
          <div>

            <h2 className="font-bold text-2xl">Items</h2>
            <Divider className="my-4" />

            <div className="space-y-4">
              {fields.map((item, index) => (
                <div key={item.id} className="item-form space-y-4">

                  <div className="flex space-x-6">
                    <p className="font-semibold my-auto">Item {index + 1}</p>
                    {index != 0 &&
                      <Button onPress={() => remove(index)} color="danger" variant="bordered">
                        Eliminar
                      </Button>
                    }
                  </div>

                  <Input
                    {...register(`items.${index}.code_reference`)}
                    label="Código de referencia"
                    isRequired
                  />

                  {errors?.items?.[index]?.code_reference?.message &&
                    <p className="text-red-500">{errors.items[index].code_reference.message}</p>
                  }

                  <Input
                    {...register(`items.${index}.name`)}
                    label="Nombre del item"
                    isRequired
                  />

                  {errors?.items?.[index]?.name?.message &&
                    <p className="text-red-500">{errors.items[index].name.message}</p>
                  }

                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Cantidad"
                        isRequired
                        type="number"
                        value={field.value !== undefined ? String(field.value) : ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />

                  {errors?.items?.[index]?.quantity?.message &&
                    <p className="text-red-500">{errors.items[index].quantity.message}</p>
                  }

                  <Controller
                    name={`items.${index}.discount_rate`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Descuento del producto"
                        isRequired
                        type="number"
                        value={field.value !== undefined ? String(field.value) : ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        step={'0.01'}
                      />
                    )}
                  />

                  {errors?.items?.[index]?.discount_rate?.message &&
                    <p className="text-red-500">{errors.items[index].discount_rate.message}</p>
                  }

                  <Controller
                    name={`items.${index}.price`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Precio del producto"
                        type="number"
                        isRequired
                        value={field.value !== undefined ? String(field.value) : ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        step={'0.01'}
                      />
                    )}
                  />

                  {errors?.items?.[index]?.price?.message &&
                    <p className="text-red-500">{errors.items[index].price.message}</p>
                  }

                  <Input
                    {...register(`items.${index}.tax_rate`)}
                    label="Impuesto aplicado"
                    isRequired
                    step={'0.01'}
                    type="number"
                  />

                  {errors?.items?.[index]?.tax_rate?.message &&
                    <p className="text-red-500">{errors.items[index].tax_rate.message}</p>
                  }

                  <Select
                    {...register(`items.${index}.unit_measure_id`)}
                    label="Unidad de medida"
                    isRequired
                    style={{ textTransform: "capitalize" }}
                    classNames={{
                      base: "dark",
                      popoverContent: "bg-gray-800 text-white",
                      trigger: "default-100 text-white border-gray-700",
                      value: "text-white",
                    }}
                  >
                    {unit_measures?.data?.map((unit: any) => (
                      <SelectItem style={{ textTransform: "capitalize" }} className="dark" key={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </Select>

                  {errors?.items?.[index]?.unit_measure_id?.message &&
                    <p className="text-red-500">{errors.items[index].unit_measure_id.message}</p>
                  }

                  <Select
                    {...register(`items.${index}.standard_code_id`)}
                    label="ID estandar"
                    isRequired
                    classNames={{
                      base: "dark",
                      popoverContent: "bg-gray-800 text-white",
                      trigger: "default-100 text-white border-gray-700",
                      value: "text-white",
                    }}
                  >
                    <SelectItem className="dark" key={1}>Estándar de adopción del contribuyente</SelectItem>
                    <SelectItem className="dark" key={2}>UNSPSC</SelectItem>
                    <SelectItem className="dark" key={3}>Partida Arancelaria</SelectItem>
                    <SelectItem className="dark" key={4}>GTIN</SelectItem>
                  </Select>

                  {errors?.items?.[index]?.standard_code_id?.message &&
                    <p className="text-red-500">{errors.items[index].standard_code_id.message}</p>
                  }

                  <div className="flex space-x-4">
                    <p>Excluído del IVA</p>
                    <Checkbox
                      onChange={(e) => e.target.checked ? setValue(`items.${index}.is_excluded`, 1) : setValue(`items.${index}.is_excluded`, 0)}
                    />
                  </div>
                  {errors?.items?.[index]?.is_excluded?.message &&
                    <p className="text-red-500">{errors.items[index].is_excluded.message}</p>
                  }

                  <Select
                    label="Tributos"
                    isRequired
                    {...register(`items.${index}.tribute_id`)}
                    classNames={{
                      base: "dark",
                      popoverContent: "bg-gray-800 text-white",
                      trigger: "default-100 text-white border-gray-700",
                      value: "text-white",
                    }}
                  >
                    {tributes?.data?.map((tribute: any) => (
                      <SelectItem className="dark" key={tribute.id}>{tribute.name}</SelectItem>
                    ))}
                  </Select>

                  {errors?.items?.[index]?.tribute_id?.message &&
                    <p className="text-red-500">{errors.items[index].tribute_id.message}</p>
                  }

                </div>
              ))}
              <Button type="button" onPress={() => append({
                code_reference: '',
                name: '',
                quantity: 1,
                discount_rate: 0,
                price: 0,
                tax_rate: '',
                unit_measure_id: 1,
                standard_code_id: 1,
                is_excluded: 0,
                tribute_id: 0,
                withholding_taxes: []
              })}>
                Añadir Item
              </Button>
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
