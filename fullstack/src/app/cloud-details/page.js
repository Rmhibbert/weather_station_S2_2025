'use client';
import React, { useState } from 'react';

const CloudDetails = () => {
  const [result, setResult] = useState(''); // State to store API result
  const [loading, setLoading] = useState(false); // State to manage loading
  const images = [
    { id: 1, src: '/images/1.png', alt: 'Cloud Image 1' },
  ];

  const handleImageClick = async (imageSrc) => {
    try {
      setLoading(true);
      const response = await fetch(imageSrc); // Fetch the image from the source
      const imageBlob = await response.blob(); // Convert image to blob

      // Create a FormData object to send the image to the Python backend
      const formData = new FormData();
      formData.append('image', imageBlob, 'uploaded_image.jpg');

      // Send the image to your Python API
      const apiResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      const resultData = await apiResponse.json(); // Parse the API response

      setResult(resultData.result); // Store the API result in state
    } catch (error) {
      console.error('Error:', error);
      setResult('Error occurred during prediction.');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="min-h-screen bg-[--color-background] text-[--foreground] flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-4">Cloud Details</h1>
      <p className="text-lg mb-6">Select an image to analyze:</p>

      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.alt}
            className="w-36 h-36 rounded-lg cursor-pointer transition-transform duration-300 hover:scale-110 hover:shadow-lg"
            onClick={() => handleImageClick(image.src)} // Call the Python API when an image is clicked
          />
        ))}
      </div>

      {loading && <p className="text-lg text-[--secondary-foreground]">Analyzing image...</p>}

      {result && (
        <div className="mt-6 p-4 bg-white text-[--foreground] rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">Prediction Result:</h3>
          <pre className="text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default CloudDetails;
