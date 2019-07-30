import * as grpcWeb from 'grpc-web';

import {
  GetModelsReq,
  GetModelsResp,
  ImageDownloadRequest,
  ImageDownloadResponse,
  ImageSegmentationRequest,
  ModelResponse,
  TextGenerationRequest,
  VisionClassificationRequest} from './services_pb';

export class ModelClient {
  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; });

  visionClassification(
    request: VisionClassificationRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ModelResponse) => void
  ): grpcWeb.ClientReadableStream<ModelResponse>;

  textGeneration(
    request: TextGenerationRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ModelResponse) => void
  ): grpcWeb.ClientReadableStream<ModelResponse>;

  imageSegmentation(
    request: ImageSegmentationRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ModelResponse) => void
  ): grpcWeb.ClientReadableStream<ModelResponse>;

  getImage(
    request: ImageDownloadRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ImageDownloadResponse) => void
  ): grpcWeb.ClientReadableStream<ImageDownloadResponse>;

  listModels(
    request: GetModelsReq,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: GetModelsResp) => void
  ): grpcWeb.ClientReadableStream<GetModelsResp>;

}

export class ModelPromiseClient {
  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; });

  visionClassification(
    request: VisionClassificationRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ModelResponse>;

  textGeneration(
    request: TextGenerationRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ModelResponse>;

  imageSegmentation(
    request: ImageSegmentationRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ModelResponse>;

  getImage(
    request: ImageDownloadRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ImageDownloadResponse>;

  listModels(
    request: GetModelsReq,
    metadata?: grpcWeb.Metadata
  ): Promise<GetModelsResp>;

}

