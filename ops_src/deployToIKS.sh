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
else
    echo "webWatcherCluster exists already..."
fi

clusterId=$(ibmcloud ks cluster ls | egrep -o 'webWatcherCluster\s*(\w*)' | cut -c18- | sed -e 's/^[[:space:]]*//')
ibmcloud ks cluster config --cluster "${clusterId}"
echo "Kubernetes context has been set"

kubectl apply -f ../kubernetes/secrets
kubectl apply -f ../kubernetes/services
kubectl apply -f ../kubernetes/deployments
kubectl apply -f ../kubernetes/jobs
echo "Kubernetes has been configured"

publicIP=$(python getClusterPublicIP.py 2>&1)
echo "NodePort Public IP: $publicIP" 

aws apigateway put-integration --rest-api-id bwaexdxnvc --resource-id q9x2az --http-method ANY --type HTTP_PROXY --uri "http://$publicIP:30002/{proxy}" --integration-http-method ANY --request-parameters proxy=method.request.path.proxy
aws apigateway create-deployment --rest-api-id bwaexdxnvc --stage-name prod --description latest 
echo "aws apigateway reverse proxies to NodePort" 