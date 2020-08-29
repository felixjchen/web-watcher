cd src/$1

docker build -t felixchen1998/web-watcher-$1:latest .
docker push felixchen1998/web-watcher-$1:latest

kubectl delete pods -l app=$1-app