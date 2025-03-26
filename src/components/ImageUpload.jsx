import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUpload.css';

const ImageUpload = () => {
  const [images, setImages] = useState([]); // State for locally uploaded images (before submission)
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [error, setError] = useState(''); // State for error messages

  // Handle file drop or selection
  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => {
      const preview = URL.createObjectURL(file);
      return { file, preview };
    });
    setImages((prevImages) => [...prevImages, ...newImages]);
    setSuccessMessage(''); // Clear success message when new images are added
    setError(''); // Clear error message when new images are added
  }, []);

  // Configure react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    multiple: true,
  });

  // Clean up preview URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  // Remove an image from the local list (before submission)
  const removeImage = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Handle form submission (show confirmation message and clear images)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (images.length === 0) {
      setError('Please upload at least one image before submitting.');
      return;
    }

    try {
      // Simulate a successful upload (no actual storage)
      console.log('Simulating upload of images:', images);

      // Clear the local images after "submission"
      images.forEach((image) => URL.revokeObjectURL(image.preview));
      setImages([]);

      // Show success message
      setSuccessMessage('Images uploaded successfully!');
    } catch (err) {
      console.error('Error during submission:', err);
      setError('Failed to process images. Please try again.');
    }
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

      {/* Display error or success message */}
      {error && <p className="text-danger mt-2">{error}</p>}
      {successMessage && <p className="text-success mt-2">{successMessage}</p>}

      {/* Preview of locally uploaded images (before submission) */}
      {images.length > 0 && (
        <div className="image-preview-container">
          <h4>Uploaded Images (Pending Submission)</h4>
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