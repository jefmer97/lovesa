# Etapa 1: Construcción (Build)
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --omit=dev

# Etapa 2: Producción (Runner)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Directorio persistente para archivos subidos (montar volumen aquí)
RUN mkdir -p /app/uploads

EXPOSE 3001

CMD ["node", "dist/main"]
