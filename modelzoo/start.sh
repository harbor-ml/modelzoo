#! /usr/bin/env sh
exec gunicorn --bind 0.0.0.0:3000 --workers 1 --timeout 100 onnxrt:app