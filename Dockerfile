# Gunakan node.js sebagai base image
FROM node:latest

# Set working directory di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json untuk menginstal dependensi
COPY package*.json ./

# Install dependensi menggunakan npm
RUN npm install

# Copy seluruh proyek Anda ke dalam container
COPY . .

# Expose port yang digunakan oleh aplikasi Anda
EXPOSE 6969

# Command untuk menjalankan aplikasi ketika container dijalankan
CMD [ "npm", "start" ]
