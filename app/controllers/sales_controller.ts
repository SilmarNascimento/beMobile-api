import Customer from '#models/customer'
import Product from '#models/product'
import ProductSale from '#models/product_sale'
import Sale from '#models/sale'
import { createSaleValidator } from '#validators/sale_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class SalesController {
  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const reqBody = request.only(['customerId', 'products'])
    const payload = await createSaleValidator.validate(reqBody)

    const customerFound = await Customer.find(payload.customerId)
    if (!customerFound) {
      return response.notFound({ message: 'Customer not found' })
    }
    const totalSalePrice: number[] = []

    const newSale = await db.transaction(async (trx) => {
      customerFound.useTransaction(trx)

      const sale = new Sale()
      sale.customerId = customerFound.id
      sale.totalPrice = 0
      sale.useTransaction(trx)
      await sale.save()

      for (const { productId, quantity } of payload.products) {
        const productFound = await Product.find(productId)
        if (!productFound || productFound.deletedAt !== null) {
          return
        }

        const productSale = new ProductSale()
        productSale.productId = productId
        productSale.saleId = sale.id
        productSale.quantity = quantity
        productSale.price = productFound.price
        productSale.useTransaction(trx)
        await productSale.save()

        totalSalePrice.push(productSale.quantity * productSale.price)
      }

      sale.totalPrice = totalSalePrice.reduce((acc, curr) => acc + curr, 0)
      await sale.save()

      return sale
    })

    if (!newSale) {
      return response.notFound({ message: 'Product not found or available' })
    }

    await newSale?.load('items')

    return response.created(newSale)
  }
}
