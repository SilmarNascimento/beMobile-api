import vine from '@vinejs/vine'

export const customerAttributeFields = ['name', 'cpf', 'address', 'telephone']

export const createCustomerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    cpf: vine.string().fixedLength(11),
    address: vine.object({
      street: vine.string(),
      number: vine.number().optional(),
      zipCode: vine.string(),
      city: vine.string(),
      state: vine.string(),
      country: vine.string(),
    }),
    telephone: vine.object({
      number: vine.string(),
    }),
  })
)

export const updateCustomerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),
    cpf: vine.string().fixedLength(11).optional(),
    address: vine
      .object({
        street: vine.string().optional(),
        number: vine.number().optional(),
        zipCode: vine.string().optional(),
        city: vine.string().optional(),
        state: vine.string().optional(),
        country: vine.string().optional(),
      })
      .optional(),
    telephone: vine
      .object({
        number: vine.string(),
      })
      .optional(),
  })
)
