/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Control the movie modal, fetching trailer and streaming services
*/

import { useState, useEffect } from 'react';
import { fetchStreamingServices } from '../services/streamingService';

export default function MovieModal({ movie, onClose }) {
  const [streamingServices, setStreamingServices] = useState(null);
  // For when the movie prop changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch streaming services 
        try {
          const services = await fetchStreamingServices({
            name: movie.title,
          });
          // Update state with fetched services
          setStreamingServices(services);
        } catch (servicesError) {
          console.log('Streaming services unavailable:', servicesError.message);
          setStreamingServices([]); 
        }
      } catch (mainError) {
        console.log(mainError.message);
        setStreamingServices([]);
      }
    };
    fetchData();
  }, [movie]);

  return (
    <div className="modal">
      <div className="modal-container"> 
        {/* Trailer section */}
        <div className="trailer-container"> 
          {movie.trailer ? (
            <iframe
              src={`https://youtube.com/embed/${movie.trailer}`}
              allowFullScreen
            />
          ) : (
            <div className="loading-state">No trailer available.</div> 
          )} {/*fallback if no trailer*/}
        </div>
        <div className="streaming-container">
          {/* Streaming services section */}
          <h3>Streaming Services</h3>
          {streamingServices === null ? (
            <div className="loading-state">Loading streaming info...</div>
          ) : streamingServices.length === 0 ? (
            <div className="error-state">No streaming info available.</div>
          ) : (
            <ul className="streaming-list">
              {streamingServices.map((service, idx) => (
                <li key={idx} className="streaming-item"> 
                  <a href={service.web_url} target="_blank" rel="noopener noreferrer" className="streaming-link">
                    {service.source_name || service.name}
                  </a>
                </li>
              ))} {/*Display all streaming*/}
            </ul>
          )}
        </div>
        {/* Close button */}
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}