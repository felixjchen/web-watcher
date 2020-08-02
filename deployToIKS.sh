#!/bin/bash
lines=$(ibmcloud ks cluster ls | grep webWatcherCluster -c)
if [ "$lines" -eq "0" ];
then
    ibmcloud ks init
    ibmcloud ks cluster create classic --name webWatcherCluster 

    while [ "$(ibmcloud ks cluster ls | grep "^.*webWatcherCluster.*deploying.*$" -c)" -eq "1" ];
    do
        sleep 30
        echo "Waiting for deployment..."
    done
    echo "webWatcherCluster has been created"

    kubectl apply -f kubernets/secrets
    kubectl apply -f kubernets/services
    kubectl apply -f kubernets/deployments
    kubectl apply -f kubernets/jobs
    echo "Kubernetes has been configured"

else
    echo "webWatcherCluster exists already..."
fi

