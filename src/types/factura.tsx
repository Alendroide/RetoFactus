import { z } from "zod";

export const billingPeriodSchema = z.object({
    start_date : z.string().date(),
    start_time : z.string().time(),
    end_date : z.string().date(),
    end_time : z.string().time()
})

export const customerSchema = z.object({
    identification : z.string(),
    dv : z.string(),
    company : z.string().nullable(),
    trade_name : z.string().nullable(),
    names : z.string().min(4),
    address : z.string(),
    email : z.string().email(),
    phone : z.string().min(8),
    legal_organization_id : z.string(),
    tribute_id : z.string(),
    identification_document_id : z.string(),
    municipality_id : z.string()
})

export const itemSchema = z.object({
    code_reference : z.string(),
    name : z.string(),
    quantity : z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number()
    ),
    discount_rate : z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number()
    ),
    price : z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number()
    ),
    tax_rate : z.string(),
    unit_measure_id : z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number()
    ),
    standard_code_id : z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number()
    ),
    is_excluded : z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number()
    ),
    tribute_id : z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number()
    ),
    withholding_taxes : z.array(z.object({
        code : z.string(),
        withholding_tax_rate : z.string()
    }))
})

export const facturaSchema = z.object({
    numbering_range_id : z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number()
    ),
    reference_code : z.string(),
    observation : z.string().nullable(),
    payment_form : z.string(),
    payment_due_date : z.string(),
    payment_method_code : z.string(),
    billing_period : billingPeriodSchema,
    customer : customerSchema,
    items : z.array(itemSchema)
})

export type crearFacturaType = z.infer<typeof facturaSchema>