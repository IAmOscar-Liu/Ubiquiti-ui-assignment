FROM node:16 AS BUILD_CLIENT

WORKDIR /app
RUN git clone https://github.com/IAmOscar-Liu/Ubiquiti-ui-assignment-frontend.git client
COPY /react_client/.env ./client/.env

WORKDIR /app/client
RUN npm install
RUN npm run build
RUN rm -rf node_modules

FROM node:16 AS BUILD_SERVER

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run gen-env
RUN npm run build

RUN rm -rf node_modules

FROM node:16 AS BUILD_OPTIMIZED_SERVER

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=BUILD_SERVER /app/dist ./dist
COPY --from=BUILD_SERVER /app/.env . 
COPY --from=BUILD_SERVER /app/.env.example .
COPY --from=BUILD_CLIENT /app/client/build ./dist/public

EXPOSE 5000
CMD [ "node", "dist/index.js" ]