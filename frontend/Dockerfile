# 1단계: 빌드
FROM node:20-slim AS build
WORKDIR /app
COPY package.json yarn.lock* ./
RUN npm install
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

# 2단계: 런타임
FROM node:20-slim
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "server.js"]