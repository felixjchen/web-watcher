import os

stream = os.popen("ibmcloud ks worker ls --cluster webWatcherCluster")
output = stream.read()
print(output.split()[12])
