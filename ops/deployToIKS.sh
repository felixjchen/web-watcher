#!/bin/bash
lines=$(ibmcloud ks cluster ls | grep webWatcherCluster -c)
if [ "$lines" -eq "0" ];
then
    ibmcloud ks init
    ibmcloud ks cluster create classic --name webWatcherCluster 

    echo "----------------------------------------------"
    while [ "$(ibmcloud ks cluster ls | grep "^.*webWatcherCluster.*normal.*$" -c)" -ne "1" ];
    do
        sleep 30
        echo "Waiting for deployment..."
    done
    echo "----------------------------------------------"

    echo "----------------------------------------------"
    echo "webWatcherCluster has been created"
    echo "----------------------------------------------"
else
    echo "----------------------------------------------"
    echo "webWatcherCluster exists already..."
    echo "----------------------------------------------"
fi

clusterId=$(ibmcloud ks cluster ls | egrep -o 'webWatcherCluster\s*(\w*)' | cut -c18- | sed -e 's/^[[:space:]]*//')
ibmcloud ks cluster config --cluster "${clusterId}"
echo "----------------------------------------------"
echo "Kubernetes context has been set"
echo "----------------------------------------------"

kubectl apply -f ../kubernetes/secrets
kubectl apply -f ../kubernetes/services
kubectl apply -f ../kubernetes/deployments
# kubectl apply -f ../kubernetes/jobs
echo "----------------------------------------------"
echo "Kubernetes has been configured"
echo "----------------------------------------------"

publicIP=$(python getClusterPublicIP.py 2>&1)
echo "----------------------------------------------"
echo "NodePort Public IP: $publicIP" 
echo "----------------------------------------------"

aws apigateway put-integration --rest-api-id bwaexdxnvc --resource-id wdi9o3 --http-method ANY --type HTTP_PROXY --uri "http://$publicIP:30002/{proxy}" --integration-http-method ANY --request-parameters integration.request.path.proxy=method.request.path.proxy
aws apigateway create-deployment --rest-api-id bwaexdxnvc --stage-name prod --description latest 
echo "----------------------------------------------"
echo "aws apigateway reverse proxies to NodePort" 
echo "----------------------------------------------"


echo "=============================================="
echo "/done"
echo "=============================================="