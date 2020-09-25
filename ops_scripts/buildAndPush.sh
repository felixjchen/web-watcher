cd ../src/$1

docker build -t felixchen1998/web-watcher-$1:latest .
docker push felixchen1998/web-watcher-$1:latest

kubectl rollout restart deployment $1-deployment