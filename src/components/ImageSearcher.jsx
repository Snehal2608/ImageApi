import React, { useState } from 'react';
import axios from 'axios';

const ImageSearcher = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const API_KEY = '0VjoIpFIJdaJXYsrcSMxY7PufbfARGj4PzOCCyk5CDo';

  const searchImages = async (e) => {
    e.preventDefault();
    setPage(1);
    setImages([]);
    fetchImages(1, query);
  };

  const fetchImages = async (pageNumber, searchQuery) => {
    setLoading(true);
    setError('');

    const API_URL = `https://api.unsplash.com/search/photos?query=${searchQuery}&page=${pageNumber}&per_page=20&client_id=${API_KEY}`;

    try {
      const response = await axios.get(API_URL);
      if (pageNumber === 1) {
        setImages(response.data.results);
      } else {
        setImages((prevImages) => [...prevImages, ...response.data.results]);
      }
      setHasMore(response.data.results.length > 0);
    } catch (error) {
      setError('Failed to fetch images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreImages = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage, query);
  };

  const downloadImage = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'downloaded-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <form onSubmit={searchImages} className="flex mb-6">
        <input
          type="text"
          placeholder="Search for images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
          className="flex-grow p-2 rounded-l-lg border-none focus:outline-none text-black"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center mb-6">Loading images...</p>}
      {error && <p className="text-center text-red-500 mb-6">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-gray-900 p-4 rounded-lg relative group">
            <img
              src={image.urls.small}
              alt={image.alt_description}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <button
              onClick={() => downloadImage(image.urls.full)}
              className="hidden group-hover:block absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12l8 8m0 0l8-8m-8 8V4" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {hasMore && !loading && (
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg mt-6 mx-auto block"
          onClick={loadMoreImages}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default ImageSearcher;
