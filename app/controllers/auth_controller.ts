import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /**
   * Register the Client
   */
  async signUp({}: HttpContext) {}

  /**
   * Authenticate the Client
   */
  async login({}: HttpContext) {}
}
