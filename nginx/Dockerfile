# Nginx 공식 이미지 사용
FROM nginx:alpine

# 로컬의 nginx.conf 파일을 컨테이너의 Nginx 설정 경로로 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 80번 포트 노출 (Docker Compose에서 이미 정의될 것이므로 필수 아님)
EXPOSE 80

# Nginx 시작 (기본 CMD로 이미 정의되어 있을 수 있음)
CMD ["nginx", "-g", "daemon off;"]