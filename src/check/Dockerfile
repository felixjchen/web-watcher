FROM golang:1.14

RUN mkdir files
COPY check.go .
COPY service_handlers.go .
RUN env GOOS=linux GOARCH=amd64 go build -v -o checkCompiled .

CMD ./checkCompiled 
