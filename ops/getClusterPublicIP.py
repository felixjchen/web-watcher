import os 

lines = os.popen("ibmcloud ks worker ls --cluster webWatcherCluster").readlines()
line = lines[2].split()
print(line[1])