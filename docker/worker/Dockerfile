FROM python:3.8-alpine

# Install dependencies
RUN apk add --update \
    build-base \
    libffi-dev


RUN mkdir /app
WORKDIR /app

# install requirements
COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt
RUN rm /requirements.txt
