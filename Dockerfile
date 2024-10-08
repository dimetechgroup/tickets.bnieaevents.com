
# Specify the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build your Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Command to run your app
CMD ["npm", "start"]
