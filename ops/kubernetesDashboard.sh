#!/bin/bash
osascript -e 'tell application "Terminal" to do script "watch kubectl get pods"'
osascript -e 'tell application "Terminal" to do script "watch kubectl top pods"'
osascript -e 'tell application "Terminal" to do script "watch kubectl top nodes"'