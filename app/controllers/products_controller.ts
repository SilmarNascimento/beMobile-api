import Product from '#models/product'
import {
  createProductValidator,
  productAttributeFields,
  updateProductValidator,
} from '#validators/product_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ProductsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const products = await Product.query()
      .whereNull('deleted_at')
      .orderBy([
        { column: 'product_name', order: 'asc' },
        { column: 'id', order: 'asc' },
      ])

    return products
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const productId = Number(params.id)
    const product = await Product.findOrFail(productId)

    return product
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const reqBody = request.only(productAttributeFields)
    const payload = await createProductValidator.validate(reqBody)

    const newProduct = await db.transaction(async (trx) => {
      const product = new Product()
      product.merge(payload)
      product.useTransaction(trx)
      await product.save()

      return product
    })

    return response.created(newProduct)
  }

  /**
   * Update individual record
   */
  async update({ params, request, response }: HttpContext) {
    const productId = Number(params.id)
    const productFound = await Product.findOrFail(productId)

    if (productFound.deletedAt !== null) {
      return response.notFound({ message: 'Produto not available' })
    }

    const reqBody = request.only(productAttributeFields)
    const payload = await updateProductValidator.validate(reqBody)

    productFound.merge(payload)
    await productFound.save()

    return response.send(productFound)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const productId = Number(params.id)

    const product = await Product.findOrFail(productId)
    await product.softDelete()

    return response.noContent()
  }
}
