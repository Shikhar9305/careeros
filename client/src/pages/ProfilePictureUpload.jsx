import { useState, useRef } from "react"

const ProfilePictureUpload = ({ currentImage, onImageUpdate }) => {
  const [preview, setPreview] = useState(currentImage || null)
  const fileInputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file")
      return
    }

    // Read file as data URL for preview
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target?.result
      setPreview(imageData)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveImage = () => {
    if (preview) {
      setIsUploading(true)
      // Simulate upload delay
      setTimeout(() => {
        onImageUpdate(preview)
        setIsUploading(false)
        alert("Profile picture updated successfully!")
      }, 500)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageUpdate(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg">
          {preview ? (
            <img src={preview || "/placeholder.svg"} alt="Profile Preview" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </div>
        <p className="mt-3 text-sm text-gray-600 text-center">
          {preview ? "Preview: Click 'Save' to confirm" : "No image selected yet"}
        </p>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-center w-full"
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-lg font-medium text-gray-700">
            {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
          </p>
          <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        {preview && (
          <>
            <button
              onClick={handleSaveImage}
              disabled={isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Saving..." : "Save Picture"}
            </button>
            <button
              onClick={handleRemoveImage}
              className="px-6 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-medium transition-colors border border-red-200"
            >
              Remove
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <span className="font-medium">Tip:</span> Use a clear, professional photo for best results. Your profile
          picture will be visible in the dashboard header.
        </p>
      </div>
    </div>
  )
}

export default ProfilePictureUpload