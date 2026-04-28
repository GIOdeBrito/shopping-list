FROM php:8.3-apache AS base

RUN a2enmod rewrite

EXPOSE 80

FROM base AS release
WORKDIR /var/www/html
COPY ./public_html/ .

FROM base AS dev
