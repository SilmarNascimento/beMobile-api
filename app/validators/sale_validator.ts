import vine from '@vinejs/vine'

export const createSaleValidator = vine.compile(
  vine.object({
    customerId: vine.number(),
    products: vine.array(
      vine.object({
        productId: vine.number(),
        quantity: vine.number(),
      })
    ),
  })
)
