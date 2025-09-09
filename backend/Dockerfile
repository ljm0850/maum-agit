# 빌드 스테이지
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 최종 프로덕션 단계
FROM node:18-slim
WORKDIR /app

# 프로덕션 의존성 중 컴파일이 필요한 패키지를 위해 빌드 도구 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["npm", "run", "start:prod"]