import vine from '@vinejs/vine'

export const createCustomerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    cpf: vine.string().fixedLength(11),
    address: vine.object({
      street: vine.string(),
      number: vine.string().optional(),
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
