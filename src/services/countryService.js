// src/services/countryService.js
const COUNTRY_API = 'https://restcountries.com/v3.1';

export const fetchCountries = async (query = '') => {
  try {
    let url = `${COUNTRY_API}/all?fields=name,cca2`;
    
    if (query.trim()) {
      url = `${COUNTRY_API}/name/${encodeURIComponent(query)}?fields=name,cca2`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    
    const data = await response.json();
    
    // Transform data to get country names
    return data.map(country => ({
      name: country.name.common,
      code: country.cca2
    })).sort((a, b) => a.name.localeCompare(b.name));
    
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

// Optional: Cache countries for better performance
let allCountriesCache = null;

export const getAllCountries = async () => {
  if (allCountriesCache) {
    return allCountriesCache;
  }
  
  allCountriesCache = await fetchCountries();
  return allCountriesCache;
};