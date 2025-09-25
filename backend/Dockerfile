FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# prisma schema is in ../prisma mounted via volume in compose for dev
EXPOSE 4000
CMD ["npm", "run", "start:dev"]
