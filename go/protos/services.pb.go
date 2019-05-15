// Code generated by protoc-gen-go. DO NOT EDIT.
// source: protos/services.proto

package services

import (
	context "context"
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

type VisionClassificationRequest struct {
	InputImage           []byte   `protobuf:"bytes,1,opt,name=input_image,json=inputImage,proto3" json:"input_image,omitempty"`
	NumReturns           uint32   `protobuf:"varint,2,opt,name=num_returns,json=numReturns,proto3" json:"num_returns,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *VisionClassificationRequest) Reset()         { *m = VisionClassificationRequest{} }
func (m *VisionClassificationRequest) String() string { return proto.CompactTextString(m) }
func (*VisionClassificationRequest) ProtoMessage()    {}
func (*VisionClassificationRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_edd031a16b9fa047, []int{0}
}

func (m *VisionClassificationRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_VisionClassificationRequest.Unmarshal(m, b)
}
func (m *VisionClassificationRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_VisionClassificationRequest.Marshal(b, m, deterministic)
}
func (m *VisionClassificationRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_VisionClassificationRequest.Merge(m, src)
}
func (m *VisionClassificationRequest) XXX_Size() int {
	return xxx_messageInfo_VisionClassificationRequest.Size(m)
}
func (m *VisionClassificationRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_VisionClassificationRequest.DiscardUnknown(m)
}

var xxx_messageInfo_VisionClassificationRequest proto.InternalMessageInfo

func (m *VisionClassificationRequest) GetInputImage() []byte {
	if m != nil {
		return m.InputImage
	}
	return nil
}

func (m *VisionClassificationRequest) GetNumReturns() uint32 {
	if m != nil {
		return m.NumReturns
	}
	return 0
}

type VisionClassificationResponse struct {
	Results              []*VisionClassificationResponse_Result `protobuf:"bytes,1,rep,name=results,proto3" json:"results,omitempty"`
	XXX_NoUnkeyedLiteral struct{}                               `json:"-"`
	XXX_unrecognized     []byte                                 `json:"-"`
	XXX_sizecache        int32                                  `json:"-"`
}

func (m *VisionClassificationResponse) Reset()         { *m = VisionClassificationResponse{} }
func (m *VisionClassificationResponse) String() string { return proto.CompactTextString(m) }
func (*VisionClassificationResponse) ProtoMessage()    {}
func (*VisionClassificationResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_edd031a16b9fa047, []int{1}
}

func (m *VisionClassificationResponse) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_VisionClassificationResponse.Unmarshal(m, b)
}
func (m *VisionClassificationResponse) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_VisionClassificationResponse.Marshal(b, m, deterministic)
}
func (m *VisionClassificationResponse) XXX_Merge(src proto.Message) {
	xxx_messageInfo_VisionClassificationResponse.Merge(m, src)
}
func (m *VisionClassificationResponse) XXX_Size() int {
	return xxx_messageInfo_VisionClassificationResponse.Size(m)
}
func (m *VisionClassificationResponse) XXX_DiscardUnknown() {
	xxx_messageInfo_VisionClassificationResponse.DiscardUnknown(m)
}

var xxx_messageInfo_VisionClassificationResponse proto.InternalMessageInfo

func (m *VisionClassificationResponse) GetResults() []*VisionClassificationResponse_Result {
	if m != nil {
		return m.Results
	}
	return nil
}

type VisionClassificationResponse_Result struct {
	Rank                 uint32   `protobuf:"varint,1,opt,name=rank,proto3" json:"rank,omitempty"`
	Category             string   `protobuf:"bytes,2,opt,name=category,proto3" json:"category,omitempty"`
	Proba                float32  `protobuf:"fixed32,3,opt,name=proba,proto3" json:"proba,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *VisionClassificationResponse_Result) Reset()         { *m = VisionClassificationResponse_Result{} }
func (m *VisionClassificationResponse_Result) String() string { return proto.CompactTextString(m) }
func (*VisionClassificationResponse_Result) ProtoMessage()    {}
func (*VisionClassificationResponse_Result) Descriptor() ([]byte, []int) {
	return fileDescriptor_edd031a16b9fa047, []int{1, 0}
}

func (m *VisionClassificationResponse_Result) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_VisionClassificationResponse_Result.Unmarshal(m, b)
}
func (m *VisionClassificationResponse_Result) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_VisionClassificationResponse_Result.Marshal(b, m, deterministic)
}
func (m *VisionClassificationResponse_Result) XXX_Merge(src proto.Message) {
	xxx_messageInfo_VisionClassificationResponse_Result.Merge(m, src)
}
func (m *VisionClassificationResponse_Result) XXX_Size() int {
	return xxx_messageInfo_VisionClassificationResponse_Result.Size(m)
}
func (m *VisionClassificationResponse_Result) XXX_DiscardUnknown() {
	xxx_messageInfo_VisionClassificationResponse_Result.DiscardUnknown(m)
}

var xxx_messageInfo_VisionClassificationResponse_Result proto.InternalMessageInfo

func (m *VisionClassificationResponse_Result) GetRank() uint32 {
	if m != nil {
		return m.Rank
	}
	return 0
}

func (m *VisionClassificationResponse_Result) GetCategory() string {
	if m != nil {
		return m.Category
	}
	return ""
}

func (m *VisionClassificationResponse_Result) GetProba() float32 {
	if m != nil {
		return m.Proba
	}
	return 0
}

func init() {
	proto.RegisterType((*VisionClassificationRequest)(nil), "VisionClassificationRequest")
	proto.RegisterType((*VisionClassificationResponse)(nil), "VisionClassificationResponse")
	proto.RegisterType((*VisionClassificationResponse_Result)(nil), "VisionClassificationResponse.Result")
}

func init() { proto.RegisterFile("protos/services.proto", fileDescriptor_edd031a16b9fa047) }

var fileDescriptor_edd031a16b9fa047 = []byte{
	// 250 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x7c, 0x90, 0x31, 0x4f, 0xc3, 0x30,
	0x10, 0x85, 0x71, 0x4b, 0x0b, 0x5c, 0xe9, 0x62, 0x15, 0x29, 0x0a, 0x45, 0x44, 0x11, 0x43, 0xa6,
	0x20, 0x95, 0x9d, 0x85, 0x89, 0x01, 0x86, 0x93, 0x60, 0x24, 0x72, 0xc3, 0x51, 0x59, 0x24, 0x76,
	0xf0, 0xd9, 0x48, 0xfc, 0x29, 0x7e, 0x23, 0xaa, 0x23, 0x3a, 0x45, 0xd9, 0xfc, 0x3e, 0x3d, 0xeb,
	0x3e, 0x3d, 0xb8, 0xe8, 0x9c, 0xf5, 0x96, 0x6f, 0x99, 0xdc, 0xb7, 0xae, 0x89, 0xcb, 0x98, 0xf3,
	0x0a, 0x2e, 0x5f, 0x35, 0x6b, 0x6b, 0x1e, 0x1a, 0xc5, 0xac, 0x3f, 0x74, 0xad, 0xbc, 0xb6, 0x06,
	0xe9, 0x2b, 0x10, 0x7b, 0x79, 0x0d, 0x0b, 0x6d, 0xba, 0xe0, 0x2b, 0xdd, 0xaa, 0x1d, 0x25, 0x22,
	0x13, 0xc5, 0x39, 0x42, 0x44, 0x8f, 0x7b, 0xb2, 0x2f, 0x98, 0xd0, 0x56, 0x8e, 0x7c, 0x70, 0x86,
	0x93, 0x49, 0x26, 0x8a, 0x25, 0x82, 0x09, 0x2d, 0xf6, 0x24, 0xff, 0x15, 0xb0, 0x1e, 0xbe, 0xc0,
	0x9d, 0x35, 0x4c, 0xf2, 0x1e, 0x4e, 0x1c, 0x71, 0x68, 0x3c, 0x27, 0x22, 0x9b, 0x16, 0x8b, 0xcd,
	0x4d, 0x39, 0xd6, 0x2f, 0x31, 0x96, 0xf1, 0xff, 0x53, 0xfa, 0x0c, 0xf3, 0x1e, 0x49, 0x09, 0xc7,
	0x4e, 0x99, 0xcf, 0x68, 0xb9, 0xc4, 0xf8, 0x96, 0x29, 0x9c, 0xd6, 0xca, 0xd3, 0xce, 0xba, 0x9f,
	0x28, 0x77, 0x86, 0x87, 0x2c, 0x57, 0x30, 0xeb, 0x9c, 0xdd, 0xaa, 0x64, 0x9a, 0x89, 0x62, 0x82,
	0x7d, 0xd8, 0xbc, 0xc1, 0xec, 0xc9, 0xbe, 0x53, 0x23, 0x5f, 0x60, 0x35, 0x24, 0x22, 0xd7, 0xe5,
	0xc8, 0x62, 0xe9, 0xd5, 0xa8, 0x7d, 0x7e, 0xb4, 0x9d, 0xc7, 0xe1, 0xef, 0xfe, 0x02, 0x00, 0x00,
	0xff, 0xff, 0xe2, 0x04, 0xb0, 0x41, 0x91, 0x01, 0x00, 0x00,
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// ModelClient is the client API for Model service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://godoc.org/google.golang.org/grpc#ClientConn.NewStream.
type ModelClient interface {
	VisionClassification(ctx context.Context, in *VisionClassificationRequest, opts ...grpc.CallOption) (*VisionClassificationResponse, error)
}

type modelClient struct {
	cc *grpc.ClientConn
}

func NewModelClient(cc *grpc.ClientConn) ModelClient {
	return &modelClient{cc}
}

func (c *modelClient) VisionClassification(ctx context.Context, in *VisionClassificationRequest, opts ...grpc.CallOption) (*VisionClassificationResponse, error) {
	out := new(VisionClassificationResponse)
	err := c.cc.Invoke(ctx, "/Model/VisionClassification", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ModelServer is the server API for Model service.
type ModelServer interface {
	VisionClassification(context.Context, *VisionClassificationRequest) (*VisionClassificationResponse, error)
}

// UnimplementedModelServer can be embedded to have forward compatible implementations.
type UnimplementedModelServer struct {
}

func (*UnimplementedModelServer) VisionClassification(ctx context.Context, req *VisionClassificationRequest) (*VisionClassificationResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method VisionClassification not implemented")
}

func RegisterModelServer(s *grpc.Server, srv ModelServer) {
	s.RegisterService(&_Model_serviceDesc, srv)
}

func _Model_VisionClassification_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(VisionClassificationRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ModelServer).VisionClassification(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/Model/VisionClassification",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ModelServer).VisionClassification(ctx, req.(*VisionClassificationRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _Model_serviceDesc = grpc.ServiceDesc{
	ServiceName: "Model",
	HandlerType: (*ModelServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "VisionClassification",
			Handler:    _Model_VisionClassification_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "protos/services.proto",
}
