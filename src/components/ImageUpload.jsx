// components/ImageUpload.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUpload.css';

const ImageUpload = () => {
  const [images, setImages] = useState([]); // State to store uploaded images

  // Handle file drop or selection
  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file), // Create a preview URL for the image
    }));
    setImages((prevImages) => [...prevImages, ...newImages]); // Add new images to the state
  }, []);

  // Configure react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'], // Accept only image files
    },
    multiple: true, // Allow multiple file uploads
  });

  // Clean up preview URLs to avoid memory leaks
  React.useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  // Remove an image from the list
  const removeImage = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      URL.revokeObjectURL(newImages[index].preview); // Clean up the preview URL
      newImages.splice(index, 1); // Remove the image
      return newImages;
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Please upload at least one image before submitting.');
      return;
    }
    // Log the uploaded images to the console (replace with your submission logic)
    console.log('Submitted images:', images);
    // Example: You can access the File objects for submission to a server
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image-${index}`, image.file);
    });
    // Example: Send formData to a server (uncomment and modify as needed)
    /*
    fetch('/your-api-endpoint', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setImages([]); // Clear images after successful submission
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    */
  };

  return (
    <div className="image-upload-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here...</p>
        ) : (
          <p>Drag & drop images here, or click to select files</p>
        )}
      </div>

      {/* Preview of uploaded images */}
      {images.length > 0 && (
        <div className="image-preview-container">
          <h4>Uploaded Images</h4>
          <div className="image-preview-grid">
            {images.map((image, index) => (
              <div key={index} className="image-preview">
                <img src={image.preview} alt={`Uploaded ${index}`} />
                <button
                  className="remove-image-btn"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {/* Submit Button */}
          <div className="submit-button-container">
            <button className="submit-button" onClick={handleSubmit}>
              Submit Images
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;