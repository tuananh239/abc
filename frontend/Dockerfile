FROM node:lts-slim

# set work directory
WORKDIR /app/

# add to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Install react-scripts manually
RUN npm install react-scripts@latest -g

# add app
COPY . ./

# start app
CMD ["npm", "start"]
