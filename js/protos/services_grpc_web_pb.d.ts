import * as grpcWeb from 'grpc-web';

import {
  GetModelsReq,
  GetModelsResp,
  ImageDownloadRequest,
  ImageDownloadResponse,
  TextGenerationRequest,
  TextGenerationResponse,
  VisionClassificationRequest,
  VisionClassificationResponse,
  ImageSegmentationRequest,
  ImageSegmentationResponse} from './services_pb';

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

  textGeneration(
    request: TextGenerationRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: TextGenerationResponse) => void
  ): grpcWeb.ClientReadableStream<TextGenerationResponse>;

  imageSegmentation(
    request: ImageSegmentationRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ImageSegmentationResponse) => void
  ): grpcWeb.ClientReadableStream<ImageSegmentationResponse>;

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
  ): Promise<VisionClassificationResponse>;

  textGeneration(
    request: TextGenerationRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<TextGenerationResponse>;

  imageSegmentation(
    request: ImageSegmentationRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ImageSegmentationResponse>;

  getImage(
    request: ImageDownloadRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ImageDownloadResponse>;

  listModels(
    request: GetModelsReq,
    metadata?: grpcWeb.Metadata
  ): Promise<GetModelsResp>;

}

