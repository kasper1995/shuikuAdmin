FROM node:20-alpine as builder

RUN mkdir /shuiku_admin_web

COPY ./ ./shuiku_admin_web

RUN cd /shuiku_admin_web && yarn install && yarn run buildWithIgnored

FROM nginx:stable-perl as runner

COPY --from=builder /shuiku_admin_web/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
