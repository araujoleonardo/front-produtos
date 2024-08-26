# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Exponha a porta em que a aplicação rodará
EXPOSE 5173

# Comando para iniciar a aplicação Vue no modo de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host"]