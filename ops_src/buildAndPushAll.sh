cd ../src

for service in cloud_object_storage compare configure gateway notify screenshot token
do  
    echo "=========================== $service ==========================="
    cd $service


    docker build -t felixchen1998/web-watcher-$service:latest .
    docker push felixchen1998/web-watcher-$service:latest

    kubectl rollout restart deployment $service-deployment

    cd ..
    echo "=========================== /$service ==========================="
done