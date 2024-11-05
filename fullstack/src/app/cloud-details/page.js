'use client';
import React, { useState } from 'react';

const CloudDetails = () => {
  const [result, setResult] = useState('');  // State to store API result
  const [loading, setLoading] = useState(false);  // State to manage loading
  const images = [
    { id: 1, src: '/images/1.png', alt: 'Cloud Image 1' },

  ];

  const handleImageClick = async (imageSrc) => {
    try {
      setLoading(true);
      const response = await fetch(imageSrc);  // Fetch the image from the source
      const imageBlob = await response.blob(); // Convert image to blob

      // Create a FormData object to send the image to the Python backend
      const formData = new FormData();
      formData.append('image', imageBlob, 'uploaded_image.jpg');

      // Send the image to your Python API
      const apiResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      const resultData = await apiResponse.json();  // Parse the API response

      setResult(resultData.result);  // Store the API result in state
    } catch (error) {
      console.error('Error:', error);
      setResult('Error occurred during prediction.');
    } finally {
      setLoading(false);  // Stop loading indicator
    }
  };

  return (
    <div>
      <h1>Cloud Details</h1>
      <p>Select an image to analyze:</p>

      <div className="image-gallery">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.alt}
            style={{ cursor: 'pointer', margin: '10px', width: '150px' }}
            onClick={() => handleImageClick(image.src)}  // Call the Python API when an image is clicked
          />
        ))}
      </div>

      {/* Display loading state */}
      {loading && <p>Analyzing image...</p>}

      {/* Display result from the Python API */}
      {result && (
        <div>
          <h3>Prediction Result:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default CloudDetails;




/* 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 */