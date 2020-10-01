FROM golang:1.14

# env GOOS=linux GOARCH=amd64 go build -v .
RUN mkdir files

COPY check .
CMD ./check
