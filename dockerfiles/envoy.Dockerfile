FROM envoyproxy/envoy:latest
COPY dockerfiles/envoy.yaml /etc/envoy/envoy.yaml
COPY certs/* /etc/
CMD /usr/local/bin/envoy -c /etc/envoy/envoy.yaml
