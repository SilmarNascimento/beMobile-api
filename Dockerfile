# Usar a imagem oficial do Node.js
FROM node:20-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /backend

# Copiar o package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Instalar as dependências globais necessárias para AdonisJS
RUN npm install -g @adonisjs/cli

# Expor a porta que a aplicação irá rodar
EXPOSE 3333

# Comando para rodar a aplicação em ambiente de desenvolvimento
ENTRYPOINT ["npm", "run"]
CMD [ "dev" ]
