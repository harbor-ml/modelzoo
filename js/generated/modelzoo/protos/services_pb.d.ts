import * as jspb from "google-protobuf"

import * as google_api_annotations_pb from '../../google/api/annotations_pb';
import * as modelzoo_protos_model_apis_pb from '../../modelzoo/protos/model_apis_pb';

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

export class KVPair extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KVPair.AsObject;
  static toObject(includeInstance: boolean, msg: KVPair): KVPair.AsObject;
  static serializeBinaryToWriter(message: KVPair, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KVPair;
  static deserializeBinaryFromReader(message: KVPair, reader: jspb.BinaryReader): KVPair;
}

export namespace KVPair {
  export type AsObject = {
    key: string,
    value: string,
  }
}

export class Model extends jspb.Message {
  getModelName(): string;
  setModelName(value: string): void;

  getMetadataList(): Array<KVPair>;
  setMetadataList(value: Array<KVPair>): void;
  clearMetadataList(): void;
  addMetadata(value?: KVPair, index?: number): KVPair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Model.AsObject;
  static toObject(includeInstance: boolean, msg: Model): Model.AsObject;
  static serializeBinaryToWriter(message: Model, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Model;
  static deserializeBinaryFromReader(message: Model, reader: jspb.BinaryReader): Model;
}

export namespace Model {
  export type AsObject = {
    modelName: string,
    metadataList: Array<KVPair.AsObject>,
  }
}

export class User extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): void;

  getPassword(): string;
  setPassword(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    email: string,
    password: string,
  }
}

export class RateLimitToken extends jspb.Message {
  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RateLimitToken.AsObject;
  static toObject(includeInstance: boolean, msg: RateLimitToken): RateLimitToken.AsObject;
  static serializeBinaryToWriter(message: RateLimitToken, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RateLimitToken;
  static deserializeBinaryFromReader(message: RateLimitToken, reader: jspb.BinaryReader): RateLimitToken;
}

export namespace RateLimitToken {
  export type AsObject = {
    token: string,
  }
}

export class ListModelsResponse extends jspb.Message {
  getModelsList(): Array<Model>;
  setModelsList(value: Array<Model>): void;
  clearModelsList(): void;
  addModels(value?: Model, index?: number): Model;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListModelsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListModelsResponse): ListModelsResponse.AsObject;
  static serializeBinaryToWriter(message: ListModelsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListModelsResponse;
  static deserializeBinaryFromReader(message: ListModelsResponse, reader: jspb.BinaryReader): ListModelsResponse;
}

export namespace ListModelsResponse {
  export type AsObject = {
    modelsList: Array<Model.AsObject>,
  }
}

export class ImageDownloadRequest extends jspb.Message {
  getUrl(): string;
  setUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImageDownloadRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ImageDownloadRequest): ImageDownloadRequest.AsObject;
  static serializeBinaryToWriter(message: ImageDownloadRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImageDownloadRequest;
  static deserializeBinaryFromReader(message: ImageDownloadRequest, reader: jspb.BinaryReader): ImageDownloadRequest;
}

export namespace ImageDownloadRequest {
  export type AsObject = {
    url: string,
  }
}

export class ImageDownloadResponse extends jspb.Message {
  getImage(): string;
  setImage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImageDownloadResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ImageDownloadResponse): ImageDownloadResponse.AsObject;
  static serializeBinaryToWriter(message: ImageDownloadResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImageDownloadResponse;
  static deserializeBinaryFromReader(message: ImageDownloadResponse, reader: jspb.BinaryReader): ImageDownloadResponse;
}

export namespace ImageDownloadResponse {
  export type AsObject = {
    image: string,
  }
}

export class Payload extends jspb.Message {
  getType(): PayloadType;
  setType(value: PayloadType): void;

  getImage(): modelzoo_protos_model_apis_pb.Image | undefined;
  setImage(value?: modelzoo_protos_model_apis_pb.Image): void;
  hasImage(): boolean;
  clearImage(): void;

  getText(): modelzoo_protos_model_apis_pb.Text | undefined;
  setText(value?: modelzoo_protos_model_apis_pb.Text): void;
  hasText(): boolean;
  clearText(): void;

  getTable(): modelzoo_protos_model_apis_pb.Table | undefined;
  setTable(value?: modelzoo_protos_model_apis_pb.Table): void;
  hasTable(): boolean;
  clearTable(): void;

  getPayloadCase(): Payload.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Payload.AsObject;
  static toObject(includeInstance: boolean, msg: Payload): Payload.AsObject;
  static serializeBinaryToWriter(message: Payload, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Payload;
  static deserializeBinaryFromReader(message: Payload, reader: jspb.BinaryReader): Payload;
}

export namespace Payload {
  export type AsObject = {
    type: PayloadType,
    image?: modelzoo_protos_model_apis_pb.Image.AsObject,
    text?: modelzoo_protos_model_apis_pb.Text.AsObject,
    table?: modelzoo_protos_model_apis_pb.Table.AsObject,
  }

  export enum PayloadCase { 
    PAYLOAD_NOT_SET = 0,
    IMAGE = 2,
    TEXT = 3,
    TABLE = 4,
  }
}

export class MetricItems extends jspb.Message {
  getMetricsList(): Array<MetricItems.Metric>;
  setMetricsList(value: Array<MetricItems.Metric>): void;
  clearMetricsList(): void;
  addMetrics(value?: MetricItems.Metric, index?: number): MetricItems.Metric;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MetricItems.AsObject;
  static toObject(includeInstance: boolean, msg: MetricItems): MetricItems.AsObject;
  static serializeBinaryToWriter(message: MetricItems, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MetricItems;
  static deserializeBinaryFromReader(message: MetricItems, reader: jspb.BinaryReader): MetricItems;
}

export namespace MetricItems {
  export type AsObject = {
    metricsList: Array<MetricItems.Metric.AsObject>,
  }

  export class Metric extends jspb.Message {
    getKey(): string;
    setKey(value: string): void;

    getValue(): string;
    setValue(value: string): void;

    getUnit(): string;
    setUnit(value: string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Metric.AsObject;
    static toObject(includeInstance: boolean, msg: Metric): Metric.AsObject;
    static serializeBinaryToWriter(message: Metric, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Metric;
    static deserializeBinaryFromReader(message: Metric, reader: jspb.BinaryReader): Metric;
  }

  export namespace Metric {
    export type AsObject = {
      key: string,
      value: string,
      unit: string,
    }
  }

}

export enum PayloadType { 
  IMAGE = 0,
  TEXT = 1,
  TABLE = 2,
}
