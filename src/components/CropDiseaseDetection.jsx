import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as tf from '@tensorflow/tfjs';
import './CropDiseaseDetection.css';

// Mock disease classes from Kaggle tomato dataset
const DISEASE_CLASSES = ["Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy", "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy", "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy", "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy", "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy", "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy", "Raspberry___healthy", "Soybean___healthy", "Squash___Powdery_mildew", "Strawberry___Leaf_scorch", "Strawberry___healthy", "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"];

// Preprocess image for model
const preprocessImage = (imageElement) => {
  return tf.tidy(() => {
    // Convert image to tensor, resize to 224x224, normalize to [0,1]
    let tensor = tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(tf.scalar(255));
    // Add batch dimension
    return tensor.expandDims();
  });
};

const CropDiseaseDetection = () => {
  const [images, setImages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [model, setModel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyzedImage, setAnalyzedImage] = useState(null);

  // Load TensorFlow.js model
  useEffect(() => {
    const initTf = async () => {
      try {
        await tf.setBackend('webgl');
        console.log('Backend set to:', tf.getBackend());

        const loadModel = async () => {
          try {
            console.log('Loading model...');
            const loadedModel = await tf.loadLayersModel('/models/tomato_disease_model/model.json');
            console.log('Model loaded successfully:', loadedModel);
            setModel({
              predict: async (imageElement) => {
                console.log('Predicting with image element:', imageElement);
                const tensor = preprocessImage(imageElement);
                console.log('Preprocessed tensor shape:', tensor.shape);
                const prediction = await loadedModel.predict(tensor);
                const probabilities = await prediction.data();
                console.log('Prediction probabilities:', probabilities);
                const maxIndex = probabilities.indexOf(Math.max(...probabilities));
                tensor.dispose();
                prediction.dispose();
                return DISEASE_CLASSES[maxIndex] || 'Unknown';
              },
            });
          } catch (err) {
            console.error('Error loading model:', err);
            setError('Failed to load disease detection model.');
          }
        };
        loadModel();
      } catch (err) {
        console.error('Error initializing TensorFlow.js:', err);
        setError('Failed to initialize TensorFlow.js.');
      }
    };
    initTf();
  }, []);

  // Handle file drop or selection
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const newImage = {
      file: acceptedFiles[0],
      preview: URL.createObjectURL(acceptedFiles[0]),
    };

    if (images.length > 0) {
      // Show confirmation dialog if an image already exists
      const confirmReplace = window.confirm(
        'You can only upload one image at a time. Do you want to replace the previous image?'
      );
      if (!confirmReplace) {
        // User chose not to replace, revoke the new image URL and return
        URL.revokeObjectURL(newImage.preview);
        return;
      }
      // User chose to replace, revoke the old image URL
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    }

    // Set the new image (replace the existing one)
    setImages([newImage]);
    setSuccessMessage('');
    setError('');
    setResult(null);
    setIsModalOpen(false);
    setAnalyzedImage(null);
  }, [images]);

  // Configure react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    multiple: false, // Restrict to single file upload
  });

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  // Remove an image
  const removeImage = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setResult(null);

    if (images.length === 0) {
      setError('Please upload an image before analyzing.');
      return;
    }

    try {
      console.log('Starting image analysis...');
      const image = images[0];
      console.log('Image preview URL:', image.preview);

      const imgElement = new Image();
      imgElement.src = image.preview;
      await new Promise((resolve, reject) => {
        imgElement.onload = () => {
          console.log('Image loaded successfully:', imgElement.width, 'x', imgElement.height);
          resolve();
        };
        imgElement.onerror = (err) => {
          console.error('Image loading failed:', err);
          reject(new Error('Failed to load image.'));
        };
      });

      if (!model) {
        throw new Error('Model is not loaded.');
      }

      const prediction = await model.predict(imgElement);
      setResult(prediction);

      // Create a new URL for the analyzed image to avoid revoking the original
      const analyzedImageUrl = URL.createObjectURL(image.file);
      setAnalyzedImage(analyzedImageUrl);
      console.log('Set analyzed image URL:', analyzedImageUrl);

      // Revoke URLs for all images except the analyzed one
      images.forEach((img) => {
        if (img.preview !== image.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
      setImages([]);

      setSuccessMessage('Image analyzed successfully!');
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze image. Please try again.');
    }
  };

  // Close modal handler
  const closeModal = () => {
    setIsModalOpen(false);
    setSuccessMessage('');
    setResult(null);
    if (analyzedImage) {
      console.log('Revoking analyzed image URL:', analyzedImage);
      URL.revokeObjectURL(analyzedImage);
    }
    setAnalyzedImage(null);
  };

  return (
    <div className="crop-disease-detection-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Upload an image of your plant to detect diseases.</p>
        )}
      </div>

      {error && <p className="text-danger mt-2">{error}</p>}

      {images.length > 0 && (
        <div className="image-preview-container">
          <h4>Uploaded Image (Pending Analysis)</h4>
          <div className="image-preview-grid">
            {images.map((image, index) => (
              <div key={index} className="image-preview">
                <img src={image.preview} alt={`Uploaded ${index}`} />
                <button
                  className="remove-image-btn"
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="submit-button-container">
            <button className="submit-button" onClick={handleSubmit}>
              Analyze Image
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Analysis Result</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {analyzedImage ? (
                <img
                  src={analyzedImage}
                  alt="Analyzed"
                  className="modal-image"
                  onError={() => console.error('Failed to load modal image:', analyzedImage)}
                />
              ) : (
                <p>Image unavailable</p>
              )}
              {successMessage && <p className="modal-success">{successMessage}</p>}
              {result && (
                <p className="modal-result">
                  <strong>Detected Condition:</strong> {result}
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button className="modal-close" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropDiseaseDetection;