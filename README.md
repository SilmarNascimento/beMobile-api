# Teste Técnico Back-end BeTalent 
[![NPM](https://img.shields.io/npm/l/react)](https://github.com/devsuperior/sds1-wmazoni/blob/master/LICENSE) 

# Sobre o projeto

O Teste Técnico Back-end BeTalent é uma API para gerenciamento de vendas, desenvolvida com o framework AdonisJS. A aplicação permite que usuários autenticados manipulem informações de clientes e produtos, incluindo criação, listagem, edição e deleção. Além disso, permite o registro de compras feitas por clientes, com informações detalhadas dos produtos e suas quantidades.

## Modelo conceitual
![Modelo Conceitual]("assets\diagram_ER.png")

# Tecnologias utilizadas
## Back end
- TypeScript
- AdonisJS
- JWT
- Lucid
- Japa / Sinon

## Banco de dados
- MySQL

# Como executar o projeto

O projeto pode ser executado localmente ou utilizando Docker. Primeiro, clone o repositório:

```bash
# clonar repositório
git clone git@github.com:SilmarNascimento/beMobile-api.git
```

## Executar o projeto localmente
### Pré-requisitos: 
### - NodeJS >= 20.6
### - MySQL 

Após clonar o repositório, siga os passos abaixo para acessar a pasta do projeto e instalar as dependências:

```bash
# entrar na pasta raiz do projeto back end
cd beMobile-api

# executar o projeto
npm install
```

Configure as variáveis de ambiente para conexão com o banco de dados MySQL. Crie um arquivo '.env' na raiz do projeto, usando o '.env.example' como base:

```bash
#.env

TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=pRD45ao_jypGcua3fws9iD8IzknoxCKj
NODE_ENV=development

#variáveis de ambiente para conexão com o banco de dados
DB_HOST= # IP DO HOST DO MYSQL
DB_PORT=3306 # (A porta 3306 é a porta padrão do MySQL)
DB_USER= #Usuário
DB_PASSWORD= #Password do usuário
DB_DATABASE= #Nome do Banco de dados
```

(Opcional) Para rodar os testes, crie um arquivo '.env.test':

```bash
#.env.test

TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=pRD45ao_jypGcua3fws9iD8IzknoxCKj
NODE_ENV=test

#variáveis de ambiente para conexão com o banco de dados
DB_HOST= # IP DO HOST DO MYSQL
DB_PORT=3306 # (A porta 3306 é a porta padrão do MySQL)
DB_USER= #Usuário
DB_PASSWORD= #Password do usuário
DB_DATABASE= #Nome do Banco de dados
```

Após a configuração das variáveis de ambiente para conexão com o banco de dados, utilize o comando abaixo para executar as migrations do projeto:

```bash
# entrar na pasta raiz do projeto back end
node ace migration:run
```

## Executar o projeto com Docker
### Pré-requisitos: Docker

Para rodar o projeto com Docker, execute os comandos abaixo:

```bash
# entrar na pasta raiz do projeto back end
cd beMobile-api

# subir um container com a aplicação
docker compose up -d
```

Após subir o container, a aplicação estará disponível na porta 3333. Para usar outra porta, ajuste o mapeamento no 'docker-compose.yml'.

# Rotas da aplicação

Abaixo está uma descrição detalhada de cada rota disponível na API, incluindo os métodos HTTP, URLs, parâmetros esperados e exemplos de requisições e respostas. As rotas da aplicação podem ser visualizadas na imagem abaixo. Para interagir com a aplicação, podemos usar um cliente HTTP como Insomnia ou ThunderClient. Além disso, a aplicação possui documentação Swagger para facilitar o seu uso.
Ao subir a aplicação basta acessar o endereço 'localhost:3333/docs' para ter acesso à documentação swagger da aplicação

![Rotas da aplicação]("assets\image.png")

## Documentação das rotas

### Autenticação

As únicas rotas desprotegidas da aplicação são as rotas de documentação do swagger e de registro e login de usuários. Portanto, para um usuário conseguir interagir com outras rotas da aplicação ele deve estar logado e com um token JWT válido.

#### POST /api/register

Registra um novo usuário

**Parâmetros:**
- fullName (string, obrigatório): Nome completo do usuário. Deve ter pelo menos 3 caracteres.
- email (string, obrigatório): Email do usuário. Deve ser um email válido.
- password (string, obrigatório): Senha do usuário. Deve ter pelo menos 3 caracteres.

**Validação:**
Os parâmetros são validados usando o 'signUpValidator'
```bash
signUpValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3),
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(3),
  })
)
```

**Exemplo de requisição:**

```bash
POST /api/register
Content-Type: application/json

{
  "fullName": "New user",
  "email": "new.user@example.com",
  "password": "secret123"
}
```

**Exemplo de Resposta:**

```bash
201 Created
Content-Type: application/json

{
  "id": 1,
  "fullName": "New user",
  "email": "new.user@example.com",
  "createdAt": "2024-08-05T10:00:00.000Z",
  "updatedAt": "2024-08-05T10:00:00.000Z"
}
```

**Possíveis Erros:**
- 409 Conflict: Usuário já registrado.

```bash
409 Conflict
Content-Type: application/json

{
  "message": "User already registered"
}
```


#### POST /api/login

Autentica um usuário e retorna um token JWT.

**Parâmetros:**
- email (string, obrigatório): Email do usuário. Deve ser um email válido.
- password (string, obrigatório): Senha do usuário. Deve ter pelo menos 3 caracteres.

**Validação:**
Os parâmetros são validados usando o 'loginValidator'
```bash
loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(3),
  })
)
```

**Exemplo de requisição:**

```bash
POST /api/login
Content-Type: application/json

{
  "email": "new.user@example.com",
  "password": "secret123"
}
```

**Exemplo de Resposta:**

```bash
200 Ok
Content-Type: application/json

{
  "type": "bearer",
  "token": "TokenJWT",
}
```

**Possíveis Erros:**
- 401 Unauthorized: Credenciais inválidas.

```bash
401 Unauthorized
Content-Type: application/json

{
  "message": "Invalid credentials"
}
```


### Rotas para o recurso de clientes (/customers)

#### GET /customers
Retorna uma lista de todos os clientes.

**Exemplo de requisição:**

```bash
GET /api/customers
```

**Exemplo de Resposta:**

```bash
200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "name": "Username",
    "cpf": "12345678901",
    "address": {
      "street": "Main St",
      "number": 100,
      "zipCode": "12345",
      "city": "Springfield",
      "state": "IL",
      "country": "USA"
    },
    "telephone": {
      "number": "1234567890"
    }
  },
  ...
]
```


#### GET /customers/:id

Retorna os detalhes de um cliente específico, incluindo endereço, telefone e vendas associadas. Essa rota ainda aceita query parameters year e month para filtrar as vendas associadas ao cliente.

**Parâmetros:**
- id (number, obrigatório): ID do cliente.
- Query Parameters:
  - year (number, opcional): Ano para filtrar as vendas.
  - month (number, opcional): Mês para filtrar as vendas.

**Exemplo de Resposta:**

```bash
200 OK
Content-Type: application/json

{
  "id": 1,
  "name": "Username",
  "cpf": "12345678901",
  "address": {
    "street": "Main St",
    "number": 100,
    "zipCode": "12345",
    "city": "Springfield",
    "state": "IL",
    "country": "USA"
  },
  "telephone": {
    "number": "1234567890"
  },
  "sales": [
    {
      "id": 1,
      "quantity": 2,
      "price": "21.00",
      "productId": 2,
      "saleId": 1,
      "createdAt": "2024-08-01T14:53:47.000+00:00",
      "updatedAt": "2024-08-01T14:53:47.000+00:00",
      "product": {
        "id": 2,
        "productName": "shanloo",
        "image": "url nova do shampoooo",
        "description": "produto para o cabelo bunitu",
        "category": "produto de beleza",
        "brand": "Seda",
        "price": "21.00",
        "supplier": "wow",
        "status": "available",
        "createdAt": "2024-08-01T01:59:58.000+00:00",
        "updatedAt": "2024-08-01T02:50:41.000+00:00"
      }
    }
  ]
}

```

**Possíveis Erros:**
- 404 Not Found: Cliente não encontrado com o Id fornecido.

```bash
404 Not Found
Content-Type: application/json

{
  "message": "Row not found"
}
```




### Rotas para o recurso de produtos (/products)

### Rotas para o recurso de vendas (/sales)

# Autor

Silmar Fernando do Nascimento

https://www.linkedin.com/in/silmarnascimento/
