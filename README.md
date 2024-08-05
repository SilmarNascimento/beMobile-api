# Teste Técnico Back-end BeTalent 
[![NPM](https://img.shields.io/npm/l/react)](https://github.com/devsuperior/sds1-wmazoni/blob/master/LICENSE) 

# Sobre o projeto

O Teste Técnico Back-end BeTalent é uma aplicação api back-end para uma aplicação de gerenciamento de vendas.   

A aplicação foi implementada usando o framework AdonisJS e consiste em  permitir que usuários devidamente autenticados terem a permissão de manipular informações de clientes e produtos como sua criação, listagem, edição e deleção. Além disso, usuários autenticados podem registrar compras feitas por clientes com informações detalhadas dos produtos e suas quantidades.

## Modelo conceitual
![Modelo Conceitual]('assets\diagram_ER.png')

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

O projeto pode ser executado localmente através ferramentas que suportem o NodeJs ou, para facilitar o uso e sua portabilidade, o projeto também pode ser executado utilizando Docker. Primeiramente, o projeto deve ser clonado do seguinte repositório:

```bash
# clonar repositório
git clone 
```

## Executar o projeto localmente
### Pré-requisitos: NodeJS >= 20.6, MySQL 

Após clonar o repositório do projeto, execute os comandos abaixo para acessar a pasta do projeto e instalar as dependências:

```bash
# entrar na pasta raiz do projeto back end
cd beMobile-api

# executar o projeto
npm install
```

Após a instalação das dependências do projeto, será necessário fazer a configuração das variáveis de ambiente para estabelecer uma conexão com o banco de dados MySQL. Será necessário criar um arquivo ".env" na raiz do projeto. Utilize o arquivo ".env.example" já implementado na raiz do projeto como base para a criação do ".env" da seguinte maneira:

```bash
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

Após a configuração das variáveis de ambiente para conexão com o banco de dados, utilize o comando abaixo para executar as migrations do projeto:

```bash
# entrar na pasta raiz do projeto back end
node ace migration:run
```

## Executar o projeto com Docker
### Pré-requisitos: Docker

Após clonar o repositório do projeto, execute os comandos abaixo para acessar a pasta do projeto e subir o container com a aplicação:

```bash
# entrar na pasta raiz do projeto back end
cd beMobile-api

# subir um container com a aplicação
docker compose up -d
```

# Autor

Silmar Fernando do Nascimento

https://www.linkedin.com/in/silmarnascimento/
