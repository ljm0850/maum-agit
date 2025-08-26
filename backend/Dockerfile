# 최종 프로덕션 이미지
FROM node:18
WORKDIR /app

# 로컬에서 미리 빌드된 파일 복사
COPY backend/dist ./dist
COPY backend/node_modules ./node_modules
COPY backend/package.json ./package.json
COPY backend/.env ./.env

EXPOSE 3001
CMD ["npm", "run", "start:prod"]