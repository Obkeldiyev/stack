import { useState, useRef } from "react";
import { uploadApi } from "@/lib/api";
import { toast } from "sonner";

interface PhotoUploadProps {
  onPhotoUploaded: (photoUrl: string) => void;
  currentPhoto?: string;
  disabled?: boolean;
}

export default function PhotoUpload({ onPhotoUploaded, currentPhoto, disabled }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const response = await uploadApi.uploadPhoto(file);
      onPhotoUploaded(response.url);
      toast.success("Photo uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload photo");
      setPreview(currentPhoto || null);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onPhotoUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={disabled}
      />

      {preview ? (
        <div style={{ 
          position: "relative",
          width: "120px",
          height: "120px",
          margin: "0 auto"
        }}>
          <img
            src={preview}
            alt="Profile photo"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "50%",
              border: "3px solid rgba(134, 240, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
            }}
          />
          {!disabled && (
            <button
              onClick={handleRemove}
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "2px solid white",
                background: "linear-gradient(135deg, #ff6b6b, #ff5252)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                transition: "all 0.25s ease",
                boxShadow: "0 4px 12px rgba(255, 107, 107, 0.4)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 107, 107, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 107, 107, 0.4)";
              }}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          )}
          {!disabled && (
            <button
              onClick={handleClick}
              style={{
                position: "absolute",
                bottom: "-4px",
                right: "8px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "2px solid white",
                background: "linear-gradient(135deg, #1d64d6, #19c7d8)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                transition: "all 0.25s ease",
                boxShadow: "0 4px 12px rgba(25, 199, 216, 0.4)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(25, 199, 216, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(25, 199, 216, 0.4)";
              }}
            >
              <i className="fa-solid fa-camera"></i>
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          style={{
            width: "120px",
            height: "120px",
            margin: "0 auto",
            border: "3px dashed rgba(134, 240, 255, 0.3)",
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: disabled ? "not-allowed" : "pointer",
            background: "linear-gradient(135deg, rgba(134, 240, 255, 0.05), rgba(25, 199, 216, 0.05))",
            transition: "all 0.25s ease",
            opacity: disabled ? 0.5 : 1,
            position: "relative"
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = "rgba(134, 240, 255, 0.6)";
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(134, 240, 255, 0.1), rgba(25, 199, 216, 0.1))";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = "rgba(134, 240, 255, 0.3)";
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(134, 240, 255, 0.05), rgba(25, 199, 216, 0.05))";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        >
          {uploading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "1.5rem", color: "#86f0ff", marginBottom: "4px" }}></i>
              <div style={{ color: "#86f0ff", fontSize: "0.7rem", fontWeight: "600", textAlign: "center" }}>
                Uploading...
              </div>
            </>
          ) : (
            <>
              <i className="fa-solid fa-camera" style={{ fontSize: "1.8rem", color: "#86f0ff", marginBottom: "4px" }}></i>
              <div style={{ color: "#86f0ff", fontSize: "0.7rem", fontWeight: "600", textAlign: "center", lineHeight: "1.2" }}>
                {disabled ? "Required" : "Add Photo"}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Helper text */}
      <div style={{ 
        textAlign: "center", 
        marginTop: "8px",
        fontSize: "0.8rem",
        color: "#a5b7d0"
      }}>
        {preview ? "Click camera icon to change" : "Click to upload photo"}
      </div>
    </div>
  );
}