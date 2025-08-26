# 1단계: 빌드
FROM node:18-slim AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 런타임
FROM node:18-slim
WORKDIR /app
# 1단계에서 빌드된 결과물(dist)과 패키지 정보(package.json) 복사
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
# 1단계에서 설치된 node_modules 전체를 2단계로 복사 (가장 확실한 방법)
COPY --from=build /app/node_modules ./node_modules
COPY .env ./
EXPOSE 3001
CMD ["node", "dist/main.js"]