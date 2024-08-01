import Customer from '#models/customer'
import {
  createCustomerValidator,
  customerAttributeFields,
  updateCustomerValidator,
} from '#validators/customer_validator'
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

    const customer = await Customer.query()
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

    return customer
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const reqBody = request.only(customerAttributeFields)
    const payload = await createCustomerValidator.validate(reqBody)
    const newCustomer = await db.transaction(async (trx) => {
      const { address, telephone, ...data } = payload

      data.cpf = data.cpf.replace(/\D/g, '')
      const customerFoundByCpf = await Customer.findBy('cpf', payload.cpf)
      if (customerFoundByCpf) {
        return response.badRequest({ message: 'Cpf already registered' })
      }
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

    await newCustomer?.load('address')
    await newCustomer?.load('telephone')

    return response.created(newCustomer)
  }

  /**
   * Update individual record
   */
  async update({ params, request, response }: HttpContext) {
    const customerId = Number(params.id)
    const customerFoundById = await Customer.findOrFail(customerId)

    const reqBody = request.only(customerAttributeFields)
    const payload = await updateCustomerValidator.validate(reqBody)

    const customerFoundByCpf = await Customer.findByOrFail('cpf', payload.cpf)
    if (customerFoundByCpf && customerFoundByCpf.id !== customerId) {
      return response.badRequest({ message: 'Cpf already registered' })
    }

    customerFoundById.merge(payload)
    await customerFoundById.save()

    if (payload.address) {
      const address = await customerFoundById.related('address').query().firstOrFail()
      address.merge(payload.address)
      await address.save()
    }

    if (payload.telephone) {
      const telephone = await customerFoundById.related('telephone').query().firstOrFail()
      telephone.merge(payload.telephone)
      await telephone.save()
    }

    await customerFoundById?.load('address')
    await customerFoundById?.load('telephone')

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
