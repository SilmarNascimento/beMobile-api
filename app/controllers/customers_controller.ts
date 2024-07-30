import Customer from '#models/customer'
import { createCustomerValidator } from '#validators/customer_validator'
import type { HttpContext } from '@adonisjs/core/http'

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
  async show({ params }: HttpContext) {

  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const reqBody = request.only(['name', 'cpf', 'address', 'telephone'])
    const payload = await createCustomerValidator.validate(reqBody)
  }

  /**
   * Update individual record
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
