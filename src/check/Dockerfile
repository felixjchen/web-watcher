FROM golang:1.14

RUN mkdir files
COPY check.go .
COPY service_handlers.go .

CMD go run check.go service_handlers.go