#!/bin/bash
GW_IP=$(ip route | grep '^default via' | awk '{print $3}')
export HTTP_PROXY="http://$GW_IP:7897"
export HTTPS_PROXY="http://$GW_IP:7897"
export ALL_PROXY="http://$GW_IP:7897"
echo "Proxy environment variables set to $GW_IP:7897"
