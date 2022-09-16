# This image will be built by Jenkins but it is possible to build it for test purpose

# Build the image

`docker build -f src/main/docker/Dockerfile.server -t angular-keycloak .`

# Run the image as a container

`docker run --name angular-keycloak-server -p 4300:80 -d angular-keycloak`

# Stop and remove the container

`docker rm -f angular-keycloak-server`
