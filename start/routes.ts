/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const CustomersController = () => import('#controllers/customers_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/register', [AuthController, 'signUp'])
router.post('/login', [AuthController, 'login'])

router
  .group(() => {
    router.get('/', [CustomersController, 'index'])
    router.get('/:id', [CustomersController, 'show'])
    router.post('/', [CustomersController, 'store'])
    router.put('/:id', [CustomersController, 'update'])
    router.delete('/:id', [CustomersController, 'destroy'])
  })
  .prefix('api/customers')
  .use(middleware.auth())
