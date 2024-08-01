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
    const totalSalePrice: number[] = []

    const newSale = await db.transaction(async (trx) => {
      const customerFound = await Customer.findOrFail(payload.customerId)
      customerFound.useTransaction(trx)

      const sale = new Sale()
      sale.customerId = customerFound.id
      sale.totalPrice = 0
      sale.useTransaction(trx)
      await sale.save()

      for (const { productId, quantity } of payload.products) {
        const productFound = await Product.findOrFail(productId)
        if (productFound.deletedAt !== null) {
          return response.notFound({ message: 'Product not available' })
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

    await newSale?.load('items')

    return response.created(newSale)
  }
}

/**
 *  async store({ request }: HttpContext) {
    const { products, clientId } = request.only(['clientId', 'products'])

    const totalPrice: number = products.reduce(
      (total: number, product: SaleProduct) => total + product.quantity * product.price,
      0
    )

    const sale = await db.transaction(async (trx) => {
      const newSale = await Sale.create({ clientId, totalPrice }, { client: trx })

      const saleProductsData = products.map((product: SaleProduct) => ({
        ...product,
        saleId: newSale.id,
      }))
      await SaleProduct.createMany(saleProductsData, { client: trx })

      return newSale
    })

    return await Sale.query().preload('products').where('id', sale.id).firstOrFail()
  }
 */
