'use client';
import React, { useState } from 'react';

const CloudDetails = () => {
  const [result, setResult] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const images = [
    { id: 1, src: '/images/1.png', alt: 'Cloud Image 1' }, // Sample test image
  ];

  const handleFileUpload = async (file) => {
    if (!file || (file.type !== 'image/jpeg' && file.type !== 'image/png')) {
      setError('Only JPEG and PNG images are supported.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult('');
      const formData = new FormData();
      formData.append('image', file);

      const apiResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      const resultData = await apiResponse.json();

      if (resultData.error) {
        setError(resultData.error);
      } else {
        setResult(resultData.result);
      }
    } catch (error) {
      setError('Error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = async (imageSrc) => {
    try {
      setLoading(true);
      setError('');
      setResult('');

      const response = await fetch(imageSrc);
      const imageBlob = await response.blob();

      const formData = new FormData();
      formData.append('image', imageBlob, 'uploaded_image.jpg');

      const apiResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      const resultData = await apiResponse.json();

      if (resultData.error) {
        setError(resultData.error);
      } else {
        setResult(resultData.result);
      }
    } catch (error) {
      setError('Error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileUpload(file);
  };

  return (
    <div className="min-h-screen bg-[--color-background] text-[--foreground] flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-4">Cloud Details</h1>
      <p className="text-lg mb-4">Drag and drop an image, click to upload, or use a test image below:</p>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-4 border-dashed border-gray-400 rounded-lg p-10 cursor-pointer mb-4"
      >
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={(e) => handleFileUpload(e.target.files[0])}
          className="hidden"
        />
        Drag and Drop or Click to Upload
      </div>

      <div className="flex gap-4 flex-wrap justify-center mb-4">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.alt}
            className="w-36 h-36 rounded-lg cursor-pointer transition-transform duration-300 hover:scale-110 hover:shadow-lg"
            onClick={() => handleImageClick(image.src)}
          />
        ))}
      </div>

      {loading && (
        <div className="flex items-center space-x-2 text-lg text-[--secondary-foreground] mt-4">
          <div className="loader border-4 border-t-4 border-gray-200 rounded-full w-6 h-6 animate-spin"></div>
          <span>Analyzing image...</span>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 p-4 bg-white text-black rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">Prediction Result:</h3>
          <pre className="text-sm">{result}</pre>
        </div>
      )}

      <p className="text-sm text-gray-500 mt-4">
        Note: Predictions may not always be accurate. Please double-check the results.
      </p>

      <style jsx>{`
        .loader {
          border-top-color: transparent;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default CloudDetails;
