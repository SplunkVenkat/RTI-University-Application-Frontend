FROM node:latest as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install

RUN npm run build
# Stage 2, use the compiled app, ready for production with Nginx
FROM nginx:latest
COPY --from=build /usr/local/app/dist/college /usr/share/nginx/html


# Expose port 80
EXPOSE 80