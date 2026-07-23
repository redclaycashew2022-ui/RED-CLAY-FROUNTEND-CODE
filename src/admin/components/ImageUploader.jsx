import React from "react";
import { uploadImage } from "../../services/api";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%25' height='100%25' fill='%23e5e7eb'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='11' fill='%236b7280'>Error</text></svg>";


const ImageUploader = ({ images, setImages, uploadingImages, setUploadingImages }) => {
  const handleMultipleFilesChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      e.target.value = null;
      return;
    }

    if (files.length + images.length > 5) {
      alert(`You can only upload ${5 - images.length} more images`);
      e.target.value = null;
      return;
    }

    if (files.length === 0) return;

    setUploadingImages(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadImage(file);

        if (res && res.url) {
          setImages((prev) => [...prev, res.url]);
        } else {
          throw new Error(`Upload failed for file ${i + 1}`);
        }
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert(err.message || "Failed to upload images");
    } finally {
      setUploadingImages(false);
      e.target.value = null;
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    if (images.length > 0 && window.confirm("Clear all images?")) {
      setImages([]);
    }
  };

  const moveImage = (index, direction) => {
    const newImages = [...images];
    if (direction === "up" && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === "down" && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setImages(newImages);
  };

  const triggerFileInput = () => {
    document.getElementById("imageUploadInput").click();
  };

  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded">
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-medium">Product Images (Up to 5)</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{images.length}/5</span>
          {images.length > 0 && (
            <button
              type="button"
              onClick={clearAllImages}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <input
        id="imageUploadInput"
        type="file"
        accept="image/*"
        onChange={handleMultipleFilesChange}
        multiple
        className="hidden"
        disabled={uploadingImages || images.length >= 5}
      />

      <div
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
          uploadingImages || images.length >= 5
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-[#2E8B57] hover:bg-green-50"
        }`}
      >
        <div className="text-sm text-gray-600">
          {uploadingImages ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-[#2E8B57]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Uploading...
            </span>
          ) : images.length >= 5 ? (
            "Maximum images reached"
          ) : (
            "Click to upload images"
          )}
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-24 object-cover rounded border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
              />
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs"
              >
                ✕
              </button>
              {/* Move Buttons */}
              <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, "up")}
                    className="bg-white text-gray-700 rounded w-4 h-4 flex items-center justify-center text-xs shadow"
                  >
                    ←
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, "down")}
                    className="bg-white text-gray-700 rounded w-4 h-4 flex items-center justify-center text-xs shadow"
                  >
                    →
                  </button>
                )}
              </div>
              {/* Primary Badge */}
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-[#2E8B57] text-white text-xs px-1 rounded">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;