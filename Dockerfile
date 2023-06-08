# Specify the base image
FROM node:14

# Specify the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port the app runs on
EXPOSE 3007

# Specify the command to run the app
CMD [ "npm", "start" ]
