import * as grpcWeb from 'grpc-web';

import * as google_api_annotations_pb from '../google/api/annotations_pb';
import * as protos_model_apis_pb from '../protos/model_apis_pb';

import {
  Empty,
  ImageDownloadRequest,
  ImageDownloadResponse,
  ListModelsResponse,
  MetricItems,
  Model,
  Payload,
  RateLimitToken,
  User} from './services_pb';

export class ModelzooServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  inference(
    request: Payload,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Payload) => void
  ): grpcWeb.ClientReadableStream<Payload>;

  getImage(
    request: ImageDownloadRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ImageDownloadResponse) => void
  ): grpcWeb.ClientReadableStream<ImageDownloadResponse>;

  getMetrics(
    request: Empty,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: MetricItems) => void
  ): grpcWeb.ClientReadableStream<MetricItems>;

  getToken(
    request: Empty,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: RateLimitToken) => void
  ): grpcWeb.ClientReadableStream<RateLimitToken>;

  listModels(
    request: Empty,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ListModelsResponse) => void
  ): grpcWeb.ClientReadableStream<ListModelsResponse>;

  createUser(
    request: User,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Empty) => void
  ): grpcWeb.ClientReadableStream<Empty>;

  createModel(
    request: Model,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Empty) => void
  ): grpcWeb.ClientReadableStream<Empty>;

  getUser(
    request: User,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Empty) => void
  ): grpcWeb.ClientReadableStream<Empty>;

}

export class ModelzooServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  inference(
    request: Payload,
    metadata?: grpcWeb.Metadata
  ): Promise<Payload>;

  getImage(
    request: ImageDownloadRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ImageDownloadResponse>;

  getMetrics(
    request: Empty,
    metadata?: grpcWeb.Metadata
  ): Promise<MetricItems>;

  getToken(
    request: Empty,
    metadata?: grpcWeb.Metadata
  ): Promise<RateLimitToken>;

  listModels(
    request: Empty,
    metadata?: grpcWeb.Metadata
  ): Promise<ListModelsResponse>;

  createUser(
    request: User,
    metadata?: grpcWeb.Metadata
  ): Promise<Empty>;

  createModel(
    request: Model,
    metadata?: grpcWeb.Metadata
  ): Promise<Empty>;

  getUser(
    request: User,
    metadata?: grpcWeb.Metadata
  ): Promise<Empty>;

}

