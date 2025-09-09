# 빌드 스테이지
FROM node:20-slim AS build
WORKDIR /app
COPY package.json yarn.lock* ./
RUN npm install --legacy-peer-deps 
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

# 최종 프로덕션 단계
FROM node:20-slim
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]