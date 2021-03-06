// Code generated by protoc-gen-go. DO NOT EDIT.
// source: modelzoo/protos/model_apis.proto

package modelzoo

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
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

// Image is repsented by the datauri format
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
type Image struct {
	Metadata             map[string]string `protobuf:"bytes,1,rep,name=metadata,proto3" json:"metadata,omitempty" protobuf_key:"bytes,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
	ImageDataUrl         string            `protobuf:"bytes,2,opt,name=image_data_url,json=imageDataUrl,proto3" json:"image_data_url,omitempty"`
	ModelName            string            `protobuf:"bytes,3,opt,name=model_name,json=modelName,proto3" json:"model_name,omitempty"`
	AccessToken          string            `protobuf:"bytes,4,opt,name=access_token,json=accessToken,proto3" json:"access_token,omitempty"`
	XXX_NoUnkeyedLiteral struct{}          `json:"-"`
	XXX_unrecognized     []byte            `json:"-"`
	XXX_sizecache        int32             `json:"-"`
}

func (m *Image) Reset()         { *m = Image{} }
func (m *Image) String() string { return proto.CompactTextString(m) }
func (*Image) ProtoMessage()    {}
func (*Image) Descriptor() ([]byte, []int) {
	return fileDescriptor_9ef26f1cb3fe6b35, []int{0}
}

func (m *Image) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Image.Unmarshal(m, b)
}
func (m *Image) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Image.Marshal(b, m, deterministic)
}
func (m *Image) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Image.Merge(m, src)
}
func (m *Image) XXX_Size() int {
	return xxx_messageInfo_Image.Size(m)
}
func (m *Image) XXX_DiscardUnknown() {
	xxx_messageInfo_Image.DiscardUnknown(m)
}

var xxx_messageInfo_Image proto.InternalMessageInfo

func (m *Image) GetMetadata() map[string]string {
	if m != nil {
		return m.Metadata
	}
	return nil
}

func (m *Image) GetImageDataUrl() string {
	if m != nil {
		return m.ImageDataUrl
	}
	return ""
}

func (m *Image) GetModelName() string {
	if m != nil {
		return m.ModelName
	}
	return ""
}

func (m *Image) GetAccessToken() string {
	if m != nil {
		return m.AccessToken
	}
	return ""
}

// Text is a list of string
type Text struct {
	Metadata             map[string]string `protobuf:"bytes,1,rep,name=metadata,proto3" json:"metadata,omitempty" protobuf_key:"bytes,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
	Texts                []string          `protobuf:"bytes,2,rep,name=texts,proto3" json:"texts,omitempty"`
	ModelName            string            `protobuf:"bytes,3,opt,name=model_name,json=modelName,proto3" json:"model_name,omitempty"`
	AccessToken          string            `protobuf:"bytes,4,opt,name=access_token,json=accessToken,proto3" json:"access_token,omitempty"`
	XXX_NoUnkeyedLiteral struct{}          `json:"-"`
	XXX_unrecognized     []byte            `json:"-"`
	XXX_sizecache        int32             `json:"-"`
}

func (m *Text) Reset()         { *m = Text{} }
func (m *Text) String() string { return proto.CompactTextString(m) }
func (*Text) ProtoMessage()    {}
func (*Text) Descriptor() ([]byte, []int) {
	return fileDescriptor_9ef26f1cb3fe6b35, []int{1}
}

func (m *Text) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Text.Unmarshal(m, b)
}
func (m *Text) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Text.Marshal(b, m, deterministic)
}
func (m *Text) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Text.Merge(m, src)
}
func (m *Text) XXX_Size() int {
	return xxx_messageInfo_Text.Size(m)
}
func (m *Text) XXX_DiscardUnknown() {
	xxx_messageInfo_Text.DiscardUnknown(m)
}

var xxx_messageInfo_Text proto.InternalMessageInfo

func (m *Text) GetMetadata() map[string]string {
	if m != nil {
		return m.Metadata
	}
	return nil
}

func (m *Text) GetTexts() []string {
	if m != nil {
		return m.Texts
	}
	return nil
}

func (m *Text) GetModelName() string {
	if m != nil {
		return m.ModelName
	}
	return ""
}

func (m *Text) GetAccessToken() string {
	if m != nil {
		return m.AccessToken
	}
	return ""
}

// Table is more complicated.
//It is inspired from pandas orient="index"
//>>> df.to_json(orient='index')
//'{"row 1":{"col 1":"a","col 2":"b"},"row 2":{"col 1":"c","col 2":"d"}}'
type Table struct {
	Metadata             map[string]string     `protobuf:"bytes,1,rep,name=metadata,proto3" json:"metadata,omitempty" protobuf_key:"bytes,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
	ModelName            string                `protobuf:"bytes,2,opt,name=model_name,json=modelName,proto3" json:"model_name,omitempty"`
	AccessToken          string                `protobuf:"bytes,3,opt,name=access_token,json=accessToken,proto3" json:"access_token,omitempty"`
	Table                map[string]*Table_Row `protobuf:"bytes,4,rep,name=table,proto3" json:"table,omitempty" protobuf_key:"bytes,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
	ColumnNames          []string              `protobuf:"bytes,5,rep,name=column_names,json=columnNames,proto3" json:"column_names,omitempty"`
	XXX_NoUnkeyedLiteral struct{}              `json:"-"`
	XXX_unrecognized     []byte                `json:"-"`
	XXX_sizecache        int32                 `json:"-"`
}

func (m *Table) Reset()         { *m = Table{} }
func (m *Table) String() string { return proto.CompactTextString(m) }
func (*Table) ProtoMessage()    {}
func (*Table) Descriptor() ([]byte, []int) {
	return fileDescriptor_9ef26f1cb3fe6b35, []int{2}
}

func (m *Table) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Table.Unmarshal(m, b)
}
func (m *Table) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Table.Marshal(b, m, deterministic)
}
func (m *Table) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Table.Merge(m, src)
}
func (m *Table) XXX_Size() int {
	return xxx_messageInfo_Table.Size(m)
}
func (m *Table) XXX_DiscardUnknown() {
	xxx_messageInfo_Table.DiscardUnknown(m)
}

var xxx_messageInfo_Table proto.InternalMessageInfo

func (m *Table) GetMetadata() map[string]string {
	if m != nil {
		return m.Metadata
	}
	return nil
}

func (m *Table) GetModelName() string {
	if m != nil {
		return m.ModelName
	}
	return ""
}

func (m *Table) GetAccessToken() string {
	if m != nil {
		return m.AccessToken
	}
	return ""
}

func (m *Table) GetTable() map[string]*Table_Row {
	if m != nil {
		return m.Table
	}
	return nil
}

func (m *Table) GetColumnNames() []string {
	if m != nil {
		return m.ColumnNames
	}
	return nil
}

type Table_Row struct {
	ColumnToValue        map[string]string `protobuf:"bytes,1,rep,name=column_to_value,json=columnToValue,proto3" json:"column_to_value,omitempty" protobuf_key:"bytes,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
	XXX_NoUnkeyedLiteral struct{}          `json:"-"`
	XXX_unrecognized     []byte            `json:"-"`
	XXX_sizecache        int32             `json:"-"`
}

func (m *Table_Row) Reset()         { *m = Table_Row{} }
func (m *Table_Row) String() string { return proto.CompactTextString(m) }
func (*Table_Row) ProtoMessage()    {}
func (*Table_Row) Descriptor() ([]byte, []int) {
	return fileDescriptor_9ef26f1cb3fe6b35, []int{2, 1}
}

func (m *Table_Row) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Table_Row.Unmarshal(m, b)
}
func (m *Table_Row) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Table_Row.Marshal(b, m, deterministic)
}
func (m *Table_Row) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Table_Row.Merge(m, src)
}
func (m *Table_Row) XXX_Size() int {
	return xxx_messageInfo_Table_Row.Size(m)
}
func (m *Table_Row) XXX_DiscardUnknown() {
	xxx_messageInfo_Table_Row.DiscardUnknown(m)
}

var xxx_messageInfo_Table_Row proto.InternalMessageInfo

func (m *Table_Row) GetColumnToValue() map[string]string {
	if m != nil {
		return m.ColumnToValue
	}
	return nil
}

func init() {
	proto.RegisterType((*Image)(nil), "modelzoo.Image")
	proto.RegisterMapType((map[string]string)(nil), "modelzoo.Image.MetadataEntry")
	proto.RegisterType((*Text)(nil), "modelzoo.Text")
	proto.RegisterMapType((map[string]string)(nil), "modelzoo.Text.MetadataEntry")
	proto.RegisterType((*Table)(nil), "modelzoo.Table")
	proto.RegisterMapType((map[string]string)(nil), "modelzoo.Table.MetadataEntry")
	proto.RegisterMapType((map[string]*Table_Row)(nil), "modelzoo.Table.TableEntry")
	proto.RegisterType((*Table_Row)(nil), "modelzoo.Table.Row")
	proto.RegisterMapType((map[string]string)(nil), "modelzoo.Table.Row.ColumnToValueEntry")
}

func init() { proto.RegisterFile("modelzoo/protos/model_apis.proto", fileDescriptor_9ef26f1cb3fe6b35) }

var fileDescriptor_9ef26f1cb3fe6b35 = []byte{
	// 391 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xc4, 0x93, 0xcd, 0x6e, 0xda, 0x40,
	0x14, 0x85, 0x65, 0x1b, 0x57, 0x70, 0x0d, 0x6d, 0x35, 0x65, 0x31, 0xb2, 0x8a, 0xe4, 0xa2, 0xaa,
	0xa2, 0x1b, 0x53, 0xd1, 0x0d, 0x6d, 0x37, 0x95, 0x92, 0x2c, 0xb2, 0x80, 0x85, 0xe5, 0x64, 0x6b,
	0x0d, 0x66, 0x14, 0x21, 0x6c, 0x0f, 0xb2, 0x87, 0x00, 0x79, 0x91, 0x3c, 0x59, 0x9e, 0x21, 0x8f,
	0x91, 0x68, 0xee, 0x40, 0xf8, 0x17, 0x8a, 0xb2, 0xc8, 0x06, 0x71, 0x8f, 0xbf, 0x99, 0x73, 0xce,
	0xb5, 0x0c, 0x5e, 0x2a, 0x86, 0x3c, 0xb9, 0x13, 0xa2, 0x3d, 0xc9, 0x85, 0x14, 0x45, 0x1b, 0xe7,
	0x88, 0x4d, 0x46, 0x85, 0x8f, 0x0a, 0x29, 0xaf, 0x88, 0xe6, 0xa3, 0x01, 0xf6, 0x65, 0xca, 0x6e,
	0x38, 0xf9, 0x03, 0xe5, 0x94, 0x4b, 0x36, 0x64, 0x92, 0x51, 0xc3, 0xb3, 0x5a, 0x4e, 0xa7, 0xe1,
	0xaf, 0x30, 0x1f, 0x11, 0xbf, 0xb7, 0x7c, 0x7e, 0x91, 0xc9, 0x7c, 0x11, 0xbc, 0xe0, 0xe4, 0x3b,
	0x7c, 0x1c, 0x29, 0x20, 0x52, 0x53, 0x34, 0xcd, 0x13, 0x6a, 0x7a, 0x46, 0xab, 0x12, 0x54, 0x51,
	0x3d, 0x67, 0x92, 0x5d, 0xe5, 0x09, 0x69, 0x00, 0xe8, 0x20, 0x19, 0x4b, 0x39, 0xb5, 0x90, 0xa8,
	0xa0, 0xd2, 0x67, 0x29, 0x27, 0xdf, 0xa0, 0xca, 0xe2, 0x98, 0x17, 0x45, 0x24, 0xc5, 0x98, 0x67,
	0xb4, 0x84, 0x80, 0xa3, 0xb5, 0x50, 0x49, 0xee, 0x3f, 0xa8, 0x6d, 0x45, 0x20, 0x9f, 0xc1, 0x1a,
	0xf3, 0x05, 0x35, 0x10, 0x55, 0x7f, 0x49, 0x1d, 0xec, 0x5b, 0x96, 0x4c, 0xf9, 0x32, 0x81, 0x1e,
	0xfe, 0x9a, 0x5d, 0xa3, 0xf9, 0x60, 0x40, 0x29, 0xe4, 0x73, 0x49, 0xba, 0x7b, 0x45, 0xbf, 0xae,
	0x8b, 0x2a, 0xe2, 0x68, 0xcf, 0x3a, 0xd8, 0x92, 0xcf, 0x65, 0x41, 0x4d, 0xcf, 0x52, 0x97, 0xe3,
	0xf0, 0xde, 0xbd, 0x9e, 0x2c, 0xb0, 0x43, 0x36, 0x48, 0x4e, 0xbc, 0x41, 0x44, 0x8e, 0x36, 0xdb,
	0xee, 0x60, 0x9e, 0xea, 0x60, 0xed, 0x75, 0x20, 0xbf, 0xc0, 0x96, 0xca, 0x82, 0x96, 0xd0, 0xd9,
	0xdd, 0x75, 0xc6, 0x5f, 0x6d, 0xab, 0x41, 0x75, 0x69, 0x2c, 0x92, 0x69, 0x9a, 0xa1, 0x69, 0x41,
	0x6d, 0x5c, 0xaa, 0xa3, 0x35, 0x65, 0x5b, 0xbc, 0x69, 0x31, 0xee, 0xbd, 0x01, 0x56, 0x20, 0x66,
	0xa4, 0x0f, 0x9f, 0x96, 0x3e, 0x52, 0x44, 0x9a, 0xd5, 0xdb, 0xf9, 0xb1, 0x9b, 0x31, 0x10, 0x33,
	0xff, 0x0c, 0xd1, 0x50, 0x5c, 0x2b, 0x50, 0xe7, 0xad, 0xc5, 0x9b, 0x9a, 0xfb, 0x1f, 0xc8, 0x3e,
	0xf4, 0xaa, 0x64, 0x3d, 0x80, 0xf5, 0x3a, 0x0e, 0x9c, 0xfc, 0xb9, 0x79, 0xd2, 0xe9, 0x7c, 0x39,
	0x90, 0x73, 0xe3, 0xba, 0xc1, 0x07, 0xfc, 0xa8, 0x7f, 0x3f, 0x07, 0x00, 0x00, 0xff, 0xff, 0x40,
	0x11, 0xc4, 0x7c, 0xf8, 0x03, 0x00, 0x00,
}
