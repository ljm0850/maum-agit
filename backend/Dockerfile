# 빌드 스테이지
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*
RUN npm install
COPY . .
RUN npm run build

# 최종 프로덕션 단계
FROM node:18-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["npm", "run", "start:prod"]