import * as jspb from "google-protobuf"

export class VisionClassificationRequest extends jspb.Message {
  getInputImage(): Uint8Array | string;
  getInputImage_asU8(): Uint8Array;
  getInputImage_asB64(): string;
  setInputImage(value: Uint8Array | string): void;

  getNumReturns(): number;
  setNumReturns(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VisionClassificationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VisionClassificationRequest): VisionClassificationRequest.AsObject;
  static serializeBinaryToWriter(message: VisionClassificationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VisionClassificationRequest;
  static deserializeBinaryFromReader(message: VisionClassificationRequest, reader: jspb.BinaryReader): VisionClassificationRequest;
}

export namespace VisionClassificationRequest {
  export type AsObject = {
    inputImage: Uint8Array | string,
    numReturns: number,
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

