# # Stage 1: Compile and Build angular codebase

# # Use official node image as the base image
# # Initializes a new build stage, and sets the latest node image from DockerHub registry as the base image for executing subsequent instructions relevant to the angular app’s configuration. The stage is arbitrarily named as build, to reference this stage in the nginx configuration stage.
# FROM node:lts as build

# # Set the working directory
# # Sets the default working directory in which the subsequent instructions are executed. The directory is created, if the path is not found. In the above snippet, an arbitrary path of usr/local/app is chosen as the directory to move the angular source code into.
# WORKDIR /usr/local/app
# # WORKDIR /usr/src/app

# # Add the source code to app
# COPY package.json package-lock.json ./
# # COPY package*.json /usr/local/app/
# # COPY ./ /usr/local/app/

# # Install all the dependencies
# # Executes the angular build in a new layer on top of the base node image. After this instruction is executed, the build output is stored under usr/local/app/dist/sample-angular-app and the compiled image will be used for the subsequent steps in the Dockerfile.
# RUN npm install

# # copying the files into the image by running this command
# COPY . .

# # Generate the build of the application
# RUN npm run build


# # Stage 2: Serve app with nginx server

# # Use official nginx image as the base image
# # Initializes a secondary build stage, and sets the latest nginx image from dockerhub registry as the base image for executing subsequent instructions relevant to nginx configuration.
# FROM nginx:latest

# # Copy the build output to replace the default nginx contents.
# # Copies the build output generated in stage 1 (--from=build) to replace the default nginx contents.
# COPY --from=build /usr/local/app/dist/sample-angular-app /usr/share/nginx/html

# # Expose port 80
# # Informs Docker that the nginx container listens on network port 80 at runtime. By default, the nginx server runs on port 80, hence we are exposing that specific port.
# EXPOSE 80

# RUNNING THE DOCKER IMAGE
# Execute the following command to build the docker image.
# docker build -t krish186/sample-angular-app-image:latest  .
# docker image ls
# docker run -d -p 8080:80 krish186/sample-angular-app-image:latest
# docker ps

# STAGE 1

# # Use official node image as the base image
# # Initializes a new build stage, and sets the latest node image from DockerHub registry as the base image for executing subsequent instructions relevant to the angular app’s configuration. The stage is arbitrarily named as build, to reference this stage in the nginx configuration stage.
FROM node:lts as angular-story-app-build

# # Set the working directory
# # Sets the default working directory in which the subsequent instructions are executed. The directory is created, if the path is not found. In the above snippet, an arbitrary path of usr/local/app is chosen as the directory to move the angular source code into.
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm i

COPY . .

# RUN npm run build
ENTRYPOINT ["npm", "run", "build"]

# STAGE 2

# FROM nginx:alpine
# COPY --from=angular-story-app-build /app/dist/app-to-run-inside-docker /usr/share/nginx/html
# EXPOSE 80

# docker build -t angular-story-app .
# docker run -it --rm -p 8080:80 angular-story-app
