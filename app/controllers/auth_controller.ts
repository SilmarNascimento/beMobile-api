import User from '#models/user'
import { signUpValidator } from '#validators/auth_validator'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /**
   * Register the User
   */
  async signUp({ request, response }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])
    const payload = await signUpValidator.validate(data)

    const isAlreadyRegistered = await User.findBy('email', payload.email)
    if (isAlreadyRegistered) {
      return response.conflict({ message: 'User already registered' })
    }

    const user = await User.create(payload)
    return response.created(user)
  }

  /**
   * Authenticate the User
   */
  async login({ request, auth }: HttpContext) {
    const { email, password } = request.all()
    const user = await User.verifyCredentials(email, password)

    return await auth.use('jwt').generate(user)
  }
}
