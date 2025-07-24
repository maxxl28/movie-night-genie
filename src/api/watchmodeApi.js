/*
Author: Max Liu
Email: maximilian.b.liu.28@dartmouth.edu
Purpose: Fetch movie streaming services from Watchmode
*/

import { WATCHMODE_BASE_URL } from '../utils/watchmode'; 

export async function fetchStreamingServices({ name }) {
  try {
    // Search for Watchmode ID
    const searchUrl = new URL(`${WATCHMODE_BASE_URL}/search/`);
    searchUrl.searchParams.append('apiKey', import.meta.env.VITE_WATCHMODE_API_KEY);
    searchUrl.searchParams.append('search_field', 'name');
    searchUrl.searchParams.append('search_value', name);
    searchUrl.searchParams.append('types', 'movie');

    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`Search request failed: ${searchResponse.status} ${searchResponse.statusText}`);
    }
    
    const searchData = await searchResponse.json();

    if (!searchData.title_results?.length) {
      throw new Error("No matches found in Watchmode");
    }

    // Fetch sources for streaming in the US
    const bestMatch = searchData.title_results[0];
    const sourcesUrl = new URL(`${WATCHMODE_BASE_URL}/title/${bestMatch.id}/sources/`);
    sourcesUrl.searchParams.append('apiKey', import.meta.env.VITE_WATCHMODE_API_KEY);
    sourcesUrl.searchParams.append('regions', 'US');

    const sourcesResponse = await fetch(sourcesUrl);
    if (!sourcesResponse.ok) {
      throw new Error(`Sources request failed: ${sourcesResponse.status} ${sourcesResponse.statusText}`);
    }
    
    const sourcesData = await sourcesResponse.json();
    return sourcesData;

  } catch (error) {
    throw error; 
  }
}