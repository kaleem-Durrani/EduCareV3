import { Upload, Typography, Image } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { SERVER_URL } from "../../../services/index";

const { Text } = Typography;
const { Dragger } = Upload;

export default function ImageUpload({
  editingPlan,
  uploading,
  onFileSelect,
  onFileChange,
}) {
  return (
    <>
      {editingPlan?.imageUrl && (
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Current image:</Text>
          <br />
          <Image
            width={100}
            src={`${SERVER_URL}/${editingPlan.imageUrl}`}
            alt="Current Plan Image"
            style={{ borderRadius: 4, marginTop: 4 }}
          />
        </div>
      )}

      <Dragger
        name="file"
        multiple={false}
        beforeUpload={(file) => {
          console.log("File selected:", file);
          onFileSelect(file);
          return false; // Prevent automatic upload
        }}
        onChange={(info) => {
          console.log("Upload onChange:", info);
          onFileChange(info);
        }}
        accept="image/*"
        maxCount={1}
        style={{
          border: "2px solid #d9d9d9",
          borderRadius: "6px",
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          {uploading ? "Uploading..." : "Click or drag image to upload"}
        </p>
        <p className="ant-upload-hint">
          Support for single image upload (JPG, PNG, GIF - Max 5MB)
        </p>
      </Dragger>
    </>
  );
}
