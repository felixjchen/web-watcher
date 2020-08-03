#!/bin/bash
lines=$(ibmcloud ks cluster ls | grep webWatcherCluster -c)
if [ "$lines" -eq "0" ];
then
    ibmcloud ks init
    ibmcloud ks cluster create classic --name webWatcherCluster 

    while [ "$(ibmcloud ks cluster ls | grep "^.*webWatcherCluster.*normal.*$" -c)" -ne "1" ];
    do
        sleep 30
        echo "Waiting for deployment..."
    done
    echo "webWatcherCluster has been created"

    clusterId=$(ibmcloud ks cluster ls | egrep -o 'webWatcherCluster\s*(\w*)' | cut -c18- | sed -e 's/^[[:space:]]*//')
    ibmcloud ks cluster config --cluster "${clusterId}"
    echo "Kubernetes context has been set"


else
    echo "webWatcherCluster exists already..."
fi


kubectl apply -f kubernetes/secrets
kubectl apply -f kubernetes/services
kubectl apply -f kubernetes/deployments
kubectl apply -f kubernetes/jobs
echo "Kubernetes has been configured"

ibmcloud ks worker ls --cluster webWatcherCluster