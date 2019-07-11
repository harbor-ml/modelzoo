FROM envoyproxy/envoy:latest
COPY dockerfiles/envoy_dev.yaml /etc/envoy/envoy.yaml
CMD /usr/local/bin/envoy -c /etc/envoy/envoy.yaml
