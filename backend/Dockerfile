# 스테이지 1: 빌드 단계
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# 스테이지 2: 최종 프로덕션 단계
FROM node:18-slim
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["npm", "run", "start:prod"]