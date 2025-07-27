/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Control the movie modal, fetching trailer and streaming services
*/

import { useState, useEffect } from 'react';
import { 
  fetchStreamingServices 
} from '../api';

export default function MovieModal({ movie, onClose }) {
  const [streamingServices, setStreamingServices] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch streaming services 
        try {
          const services = await fetchStreamingServices({
            name: movie.title,
          });
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
              ))} {/*display all streaming*/}
            </ul>
          )}
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}