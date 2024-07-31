import Customer from '#models/customer'
import { createCustomerValidator } from '#validators/customer_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class CustomersController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const customers = Customer.query().preload('telephone').preload('address').orderBy('id', 'asc')
    return customers
  }

  /**
   * Show individual record
   */
  async show({ params, request }: HttpContext) {
    const { year, month } = request.qs()

    const client = await Customer.query()
      .where('id', params.id)
      .preload('address', (columns) =>
        columns.select(['street', 'number', 'zip_code', 'city', 'state'])
      )
      .preload('telephone', (columns) => columns.select('number'))
      .preload('sales', (q) => {
        q.select('*')
        if (month && year) {
          q.whereRaw('YEAR(created_at) = ?', [year])
          q.whereRaw('MONTH(created_at) = ?', [month])
        }
        q.orderBy('createdAt', 'desc')
        q.preload('items', (itemsQuery) => {
          itemsQuery.preload('product')
        })
      })
      .orderBy('id', 'asc')
      .firstOrFail()

    return client
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const reqBody = request.only(['name', 'cpf', 'address', 'telephone'])
    const payload = await createCustomerValidator.validate(reqBody)
    const newClient = await db.transaction(async (trx) => {
      const { address, telephone, ...data } = payload

      data.cpf = data.cpf.replace(/\D/g, '')
      telephone.number = telephone.number.replace(/\D/g, '')

      const customer = new Customer()
      customer.useTransaction(trx)
      customer.name = data.name
      customer.cpf = data.cpf
      await customer.save()

      await customer.related('address').create(address)
      await customer.related('telephone').create(telephone)

      return customer
    })

    return response.created(newClient)
  }

  /**
   * Update individual record
   */
  async update({ params, request, response }: HttpContext) {
    const customerId = Number(params.id)
    const customerFoundById = await Customer.findOrFail(customerId)

    const data = request.only(['name', 'cpf', 'address'])
    const customerFoundByCpf = await Customer.findByOrFail(data.cpf)

    if (customerFoundByCpf && customerFoundByCpf.id !== customerId) {
      return response.badRequest({ message: 'Cpf already in used' })
    }

    await customerFoundById.merge(data).save()

    return response.send(customerFoundById)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const customerId = Number(params.id)

    const customer = await Customer.findOrFail(customerId)
    await customer.delete()

    return response.noContent()
  }
}
