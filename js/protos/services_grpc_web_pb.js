/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = require('./services_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.ModelClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.ModelPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.VisionClassificationRequest,
 *   !proto.VisionClassificationResponse>}
 */
const methodInfo_Model_VisionClassification = new grpc.web.AbstractClientBase.MethodInfo(
  proto.VisionClassificationResponse,
  /** @param {!proto.VisionClassificationRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.VisionClassificationResponse.deserializeBinary
);


/**
 * @param {!proto.VisionClassificationRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.VisionClassificationResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.VisionClassificationResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ModelClient.prototype.visionClassification =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Model/VisionClassification',
      request,
      metadata || {},
      methodInfo_Model_VisionClassification,
      callback);
};


/**
 * @param {!proto.VisionClassificationRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.VisionClassificationResponse>}
 *     A native promise that resolves to the response
 */
proto.ModelPromiseClient.prototype.visionClassification =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Model/VisionClassification',
      request,
      metadata || {},
      methodInfo_Model_VisionClassification);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.ImageDownloadRequest,
 *   !proto.ImageDownloadResponse>}
 */
const methodInfo_Model_GetImage = new grpc.web.AbstractClientBase.MethodInfo(
  proto.ImageDownloadResponse,
  /** @param {!proto.ImageDownloadRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.ImageDownloadResponse.deserializeBinary
);


/**
 * @param {!proto.ImageDownloadRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.ImageDownloadResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.ImageDownloadResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ModelClient.prototype.getImage =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Model/GetImage',
      request,
      metadata || {},
      methodInfo_Model_GetImage,
      callback);
};


/**
 * @param {!proto.ImageDownloadRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.ImageDownloadResponse>}
 *     A native promise that resolves to the response
 */
proto.ModelPromiseClient.prototype.getImage =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Model/GetImage',
      request,
      metadata || {},
      methodInfo_Model_GetImage);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.VisionClassificationGetModelsReq,
 *   !proto.VisionClassificationGetModelsResp>}
 */
const methodInfo_Model_ListModels = new grpc.web.AbstractClientBase.MethodInfo(
  proto.VisionClassificationGetModelsResp,
  /** @param {!proto.VisionClassificationGetModelsReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.VisionClassificationGetModelsResp.deserializeBinary
);


/**
 * @param {!proto.VisionClassificationGetModelsReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.VisionClassificationGetModelsResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.VisionClassificationGetModelsResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ModelClient.prototype.listModels =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Model/ListModels',
      request,
      metadata || {},
      methodInfo_Model_ListModels,
      callback);
};


/**
 * @param {!proto.VisionClassificationGetModelsReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.VisionClassificationGetModelsResp>}
 *     A native promise that resolves to the response
 */
proto.ModelPromiseClient.prototype.listModels =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Model/ListModels',
      request,
      metadata || {},
      methodInfo_Model_ListModels);
};


module.exports = proto;

