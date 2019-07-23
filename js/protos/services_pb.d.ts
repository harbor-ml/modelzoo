import * as jspb from "google-protobuf"

export class GetModelsReq extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetModelsReq.AsObject;
  static toObject(includeInstance: boolean, msg: GetModelsReq): GetModelsReq.AsObject;
  static serializeBinaryToWriter(message: GetModelsReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetModelsReq;
  static deserializeBinaryFromReader(message: GetModelsReq, reader: jspb.BinaryReader): GetModelsReq;
}

export namespace GetModelsReq {
  export type AsObject = {
  }
}

export class ModelResponse extends jspb.Message {
  getTypestring(): string;
  setTypestring(value: string): void;

  getText(): TextGenerationResponse | undefined;
  setText(value?: TextGenerationResponse): void;
  hasText(): boolean;
  clearText(): void;

  getVision(): VisionClassificationResponse | undefined;
  setVision(value?: VisionClassificationResponse): void;
  hasVision(): boolean;
  clearVision(): void;

  getSegment(): ImageSegmentationResponse | undefined;
  setSegment(value?: ImageSegmentationResponse): void;
  hasSegment(): boolean;
  clearSegment(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModelResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ModelResponse): ModelResponse.AsObject;
  static serializeBinaryToWriter(message: ModelResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModelResponse;
  static deserializeBinaryFromReader(message: ModelResponse, reader: jspb.BinaryReader): ModelResponse;
}

export namespace ModelResponse {
  export type AsObject = {
    typestring: string,
    text?: TextGenerationResponse.AsObject,
    vision?: VisionClassificationResponse.AsObject,
    segment?: ImageSegmentationResponse.AsObject,
  }
}

export class GetModelsResp extends jspb.Message {
  getModelsList(): Array<GetModelsResp.Model>;
  setModelsList(value: Array<GetModelsResp.Model>): void;
  clearModelsList(): void;
  addModels(value?: GetModelsResp.Model, index?: number): GetModelsResp.Model;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetModelsResp.AsObject;
  static toObject(includeInstance: boolean, msg: GetModelsResp): GetModelsResp.AsObject;
  static serializeBinaryToWriter(message: GetModelsResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetModelsResp;
  static deserializeBinaryFromReader(message: GetModelsResp, reader: jspb.BinaryReader): GetModelsResp;
}

export namespace GetModelsResp {
  export type AsObject = {
    modelsList: Array<GetModelsResp.Model.AsObject>,
  }

  export class Model extends jspb.Message {
    getModelName(): string;
    setModelName(value: string): void;

    getModelCategory(): ModelCategory;
    setModelCategory(value: ModelCategory): void;

    getUuid(): string;
    setUuid(value: string): void;

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
      modelCategory: ModelCategory,
      uuid: string,
    }
  }

}

export class TextGenerationRequest extends jspb.Message {
  getInputPhrase(): string;
  setInputPhrase(value: string): void;

  getTemperature(): number;
  setTemperature(value: number): void;

  getModelUuid(): string;
  setModelUuid(value: string): void;

  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TextGenerationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TextGenerationRequest): TextGenerationRequest.AsObject;
  static serializeBinaryToWriter(message: TextGenerationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TextGenerationRequest;
  static deserializeBinaryFromReader(message: TextGenerationRequest, reader: jspb.BinaryReader): TextGenerationRequest;
}

export namespace TextGenerationRequest {
  export type AsObject = {
    inputPhrase: string,
    temperature: number,
    modelUuid: string,
    token: string,
  }
}

export class TextGenerationResponse extends jspb.Message {
  getGeneratedTextsList(): Array<string>;
  setGeneratedTextsList(value: Array<string>): void;
  clearGeneratedTextsList(): void;
  addGeneratedTexts(value: string, index?: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TextGenerationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TextGenerationResponse): TextGenerationResponse.AsObject;
  static serializeBinaryToWriter(message: TextGenerationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TextGenerationResponse;
  static deserializeBinaryFromReader(message: TextGenerationResponse, reader: jspb.BinaryReader): TextGenerationResponse;
}

export namespace TextGenerationResponse {
  export type AsObject = {
    generatedTextsList: Array<string>,
  }
}

export class VisionClassificationRequest extends jspb.Message {
  getInputImage(): string;
  setInputImage(value: string): void;

  getNumReturns(): number;
  setNumReturns(value: number): void;

  getModelUuid(): string;
  setModelUuid(value: string): void;

  getToken(): string;
  setToken(value: string): void;

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
    modelUuid: string,
    token: string,
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

export class ImageSegmentationRequest extends jspb.Message {
  getInputImage(): string;
  setInputImage(value: string): void;

  getModelUuid(): string;
  setModelUuid(value: string): void;

  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImageSegmentationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ImageSegmentationRequest): ImageSegmentationRequest.AsObject;
  static serializeBinaryToWriter(message: ImageSegmentationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImageSegmentationRequest;
  static deserializeBinaryFromReader(message: ImageSegmentationRequest, reader: jspb.BinaryReader): ImageSegmentationRequest;
}

export namespace ImageSegmentationRequest {
  export type AsObject = {
    inputImage: string,
    modelUuid: string,
    token: string,
  }
}

export class ImageSegmentationResponse extends jspb.Message {
  getOutputImage(): string;
  setOutputImage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImageSegmentationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ImageSegmentationResponse): ImageSegmentationResponse.AsObject;
  static serializeBinaryToWriter(message: ImageSegmentationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImageSegmentationResponse;
  static deserializeBinaryFromReader(message: ImageSegmentationResponse, reader: jspb.BinaryReader): ImageSegmentationResponse;
}

export namespace ImageSegmentationResponse {
  export type AsObject = {
    outputImage: string,
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

export enum ModelCategory { 
  VISIONCLASSIFICATION = 0,
  TEXTGENERATION = 1,
  IMAGESEGMENTATION = 2,
  IMAGECAPTIONING = 3,
}
