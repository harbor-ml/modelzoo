import * as grpcWeb from 'grpc-web';

import {
  VisionClassificationRequest,
  VisionClassificationResponse} from './services_pb';

export class ModelClient {
  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; });

  visionClassification(
    request: VisionClassificationRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: VisionClassificationResponse) => void
  ): grpcWeb.ClientReadableStream<VisionClassificationResponse>;

}

export class ModelPromiseClient {
  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; });

  visionClassification(
    request: VisionClassificationRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<VisionClassificationResponse>;

}

