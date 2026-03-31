# Sử dụng image Node.js bản nhẹ (alpine)
FROM node:18-alpine

# Cài đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json vào trước
COPY package*.json ./

# Cài đặt các dependencies (chỉ cài các gói cho production để nhẹ container)
RUN npm install --production

# Copy toàn bộ code từ thư mục backend local vào container
COPY . .

# Mở cổng 5000 (Khớp với PORT trong code Node.js)
EXPOSE 5000

# Lệnh khởi chạy server
CMD ["node", "src/server.js"]