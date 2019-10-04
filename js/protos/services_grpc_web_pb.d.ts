import * as grpcWeb from 'grpc-web';

import {
  Empty,
  Image,
  ImageDownloadRequest,
  ImageDownloadResponse,
  ListModelsResponse,
  Model,
  Table,
  Text,
  User} from './services_pb';

export class ModelzooServiceClient {
  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; });

  visionClassification(
    request: Image,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Table) => void
  ): grpcWeb.ClientReadableStream<Table>;

  textGeneration(
    request: Text,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Text) => void
  ): grpcWeb.ClientReadableStream<Text>;

  imageSegmentation(
    request: Image,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Image) => void
  ): grpcWeb.ClientReadableStream<Image>;

  imageCaption(
    request: Image,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: Text) => void
  ): grpcWeb.ClientReadableStream<Text>;

  getImage(
    request: ImageDownloadRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ImageDownloadResponse) => void
  ): grpcWeb.ClientReadableStream<ImageDownloadResponse>;

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

}

export class ModelzooServicePromiseClient {
  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; });

  visionClassification(
    request: Image,
    metadata?: grpcWeb.Metadata
  ): Promise<Table>;

  textGeneration(
    request: Text,
    metadata?: grpcWeb.Metadata
  ): Promise<Text>;

  imageSegmentation(
    request: Image,
    metadata?: grpcWeb.Metadata
  ): Promise<Image>;

  imageCaption(
    request: Image,
    metadata?: grpcWeb.Metadata
  ): Promise<Text>;

  getImage(
    request: ImageDownloadRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ImageDownloadResponse>;

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

}

