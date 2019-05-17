import * as grpcWeb from 'grpc-web';

import {
  ImageDownloadRequest,
  ImageDownloadResponse,
  VisionClassificationGetModelsReq,
  VisionClassificationGetModelsResp,
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

  getImage(
    request: ImageDownloadRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ImageDownloadResponse) => void
  ): grpcWeb.ClientReadableStream<ImageDownloadResponse>;

  listModels(
    request: VisionClassificationGetModelsReq,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: VisionClassificationGetModelsResp) => void
  ): grpcWeb.ClientReadableStream<VisionClassificationGetModelsResp>;

}

export class ModelPromiseClient {
  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; });

  visionClassification(
    request: VisionClassificationRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<VisionClassificationResponse>;

  getImage(
    request: ImageDownloadRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ImageDownloadResponse>;

  listModels(
    request: VisionClassificationGetModelsReq,
    metadata?: grpcWeb.Metadata
  ): Promise<VisionClassificationGetModelsResp>;

}

