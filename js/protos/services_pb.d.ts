import * as jspb from "google-protobuf"

export class VisionClassificationGetModelsReq extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VisionClassificationGetModelsReq.AsObject;
  static toObject(includeInstance: boolean, msg: VisionClassificationGetModelsReq): VisionClassificationGetModelsReq.AsObject;
  static serializeBinaryToWriter(message: VisionClassificationGetModelsReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VisionClassificationGetModelsReq;
  static deserializeBinaryFromReader(message: VisionClassificationGetModelsReq, reader: jspb.BinaryReader): VisionClassificationGetModelsReq;
}

export namespace VisionClassificationGetModelsReq {
  export type AsObject = {
  }
}

export class VisionClassificationGetModelsResp extends jspb.Message {
  getModelsList(): Array<string>;
  setModelsList(value: Array<string>): void;
  clearModelsList(): void;
  addModels(value: string, index?: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VisionClassificationGetModelsResp.AsObject;
  static toObject(includeInstance: boolean, msg: VisionClassificationGetModelsResp): VisionClassificationGetModelsResp.AsObject;
  static serializeBinaryToWriter(message: VisionClassificationGetModelsResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VisionClassificationGetModelsResp;
  static deserializeBinaryFromReader(message: VisionClassificationGetModelsResp, reader: jspb.BinaryReader): VisionClassificationGetModelsResp;
}

export namespace VisionClassificationGetModelsResp {
  export type AsObject = {
    modelsList: Array<string>,
  }
}

export class VisionClassificationRequest extends jspb.Message {
  getInputImage(): string;
  setInputImage(value: string): void;

  getNumReturns(): number;
  setNumReturns(value: number): void;

  getModelName(): string;
  setModelName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VisionClassificationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VisionClassificationRequest): VisionClassificationRequest.AsObject;
  static serializeBinaryToWriter(message: VisionClassificationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VisionClassificationRequest;
  static deserializeBinaryFromReader(message: VisionClassificationRequest, reader: jspb.BinaryReader): VisionClassificationRequest;
}

export namespace VisionClassificationRequest {
  export type AsObject = {
    inputImage: string,
    numReturns: number,
    modelName: string,
  }
}

export class VisionClassificationResponse extends jspb.Message {
  getResultsList(): Array<VisionClassificationResponse.Result>;
  setResultsList(value: Array<VisionClassificationResponse.Result>): void;
  clearResultsList(): void;
  addResults(value?: VisionClassificationResponse.Result, index?: number): VisionClassificationResponse.Result;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VisionClassificationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VisionClassificationResponse): VisionClassificationResponse.AsObject;
  static serializeBinaryToWriter(message: VisionClassificationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VisionClassificationResponse;
  static deserializeBinaryFromReader(message: VisionClassificationResponse, reader: jspb.BinaryReader): VisionClassificationResponse;
}

export namespace VisionClassificationResponse {
  export type AsObject = {
    resultsList: Array<VisionClassificationResponse.Result.AsObject>,
  }

  export class Result extends jspb.Message {
    getRank(): number;
    setRank(value: number): void;

    getCategory(): string;
    setCategory(value: string): void;

    getProba(): number;
    setProba(value: number): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Result.AsObject;
    static toObject(includeInstance: boolean, msg: Result): Result.AsObject;
    static serializeBinaryToWriter(message: Result, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Result;
    static deserializeBinaryFromReader(message: Result, reader: jspb.BinaryReader): Result;
  }

  export namespace Result {
    export type AsObject = {
      rank: number,
      category: string,
      proba: number,
    }
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

