import axios from 'axios';

// Get list of countries
export const getCountries = async (req, res) => {
  try {
    // Fallback countries list - always prepared
    const fallbackCountries = [
      { name: 'Bangladesh', code: 'BD' },
      { name: 'United States', code: 'US' },
      { name: 'United Kingdom', code: 'GB' },
      { name: 'Canada', code: 'CA' },
      { name: 'Australia', code: 'AU' },
      { name: 'India', code: 'IN' },
      { name: 'Pakistan', code: 'PK' },
      { name: 'China', code: 'CN' },
      { name: 'Japan', code: 'JP' },
      { name: 'Germany', code: 'DE' },
      { name: 'France', code: 'FR' },
      { name: 'Italy', code: 'IT' },
      { name: 'Brazil', code: 'BR' },
      { name: 'South Africa', code: 'ZA' },
    ].sort((a, b) => a.name.localeCompare(b.name));
    
    // Try to fetch from API, with a timeout to avoid long waiting
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca2', {
        timeout: 3000 // 3 seconds timeout
      });
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const formattedCountries = response.data
          .map(country => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        return res.status(200).json(formattedCountries);
      } else {
        // If response is not as expected, use fallback
        throw new Error('Invalid API response format');
      }
    } catch (apiError) {
      console.error('Error fetching countries from API:', apiError);
      console.log('Using fallback countries list');
      // Just use the fallback on any API error
      return res.status(200).json(fallbackCountries);
    }
  } catch (error) {
    console.error('Unexpected error in getCountries:', error);
    // Always ensure we return the fallback list even on unexpected errors
    const fallbackCountries = [
      { name: 'Bangladesh', code: 'BD' },
      { name: 'United States', code: 'US' },
      { name: 'United Kingdom', code: 'GB' },
      { name: 'Canada', code: 'CA' },
      { name: 'Australia', code: 'AU' },
      { name: 'India', code: 'IN' },
    ].sort((a, b) => a.name.localeCompare(b.name));
    
    return res.status(200).json(fallbackCountries);
  }
};

// Get universities by country
export const getUniversitiesByCountry = async (req, res) => {
  try {
    const { country } = req.query;
    
    if (!country) {
      return res.status(400).json({ message: 'Country parameter is required' });
    }
    
    // Common universities fallback by country (limited list for common countries)
    const fallbackUniversities = {
      'Bangladesh': [
        { name: 'University of Dhaka', id: 'uni_bd_1' },
        { name: 'Bangladesh University of Engineering and Technology', id: 'uni_bd_2' },
        { name: 'North South University', id: 'uni_bd_3' },
        { name: 'BRAC University', id: 'uni_bd_4' },
        { name: 'Dhaka Medical College', id: 'uni_bd_5' },
        { name: 'Jahangirnagar University', id: 'uni_bd_6' },
        { name: 'East West University', id: 'uni_bd_7' },
        { name: 'United International University', id: 'uni_bd_8' }
      ],
      'United States': [
        { name: 'Harvard University', id: 'uni_us_1' },
        { name: 'Massachusetts Institute of Technology', id: 'uni_us_2' },
        { name: 'Stanford University', id: 'uni_us_3' },
        { name: 'University of California, Berkeley', id: 'uni_us_4' },
        { name: 'Yale University', id: 'uni_us_5' }
      ],
      'United Kingdom': [
        { name: 'University of Oxford', id: 'uni_uk_1' },
        { name: 'University of Cambridge', id: 'uni_uk_2' },
        { name: 'Imperial College London', id: 'uni_uk_3' },
        { name: 'University College London', id: 'uni_uk_4' },
        { name: 'University of Edinburgh', id: 'uni_uk_5' }
      ],
      'India': [
        { name: 'Indian Institute of Technology Bombay', id: 'uni_in_1' },
        { name: 'Indian Institute of Science', id: 'uni_in_2' },
        { name: 'University of Delhi', id: 'uni_in_3' },
        { name: 'Jawaharlal Nehru University', id: 'uni_in_4' },
        { name: 'Tata Institute of Fundamental Research', id: 'uni_in_5' }
      ]
    };
    
    // Check if we have fallback for this country
    if (fallbackUniversities[country]) {
      return res.status(200).json(fallbackUniversities[country]);
    }
    
    // Try to fetch from API with timeout
    try {
      const response = await axios.get(
        `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`,
        { timeout: 3000 } // 3 seconds timeout
      );
      
      if (response.data && Array.isArray(response.data)) {
        const formattedUniversities = response.data
          .filter((uni, index, self) => 
            index === self.findIndex(u => u.name === uni.name)
          )
          .map((uni, index) => ({
            name: uni.name,
            id: `uni_${index}`,
          }));
        
        // If we got empty list from API, return a generic list
        if (formattedUniversities.length === 0) {
          return res.status(200).json([
            { name: 'National University', id: 'uni_default_1' },
            { name: 'Technical University', id: 'uni_default_2' },
            { name: 'Regional University', id: 'uni_default_3' },
            { name: 'Central University', id: 'uni_default_4' },
            { name: 'International University', id: 'uni_default_5' }
          ]);
        }
        
        return res.status(200).json(formattedUniversities);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (apiError) {
      console.error('Error fetching universities:', apiError);
      
      // Return generic universities if no fallback
      return res.status(200).json([
        { name: 'National University', id: 'uni_default_1' },
        { name: 'Technical University', id: 'uni_default_2' },
        { name: 'Regional University', id: 'uni_default_3' },
        { name: 'Central University', id: 'uni_default_4' },
        { name: 'International University', id: 'uni_default_5' }
      ]);
    }
  } catch (error) {
    console.error('Unexpected error in getUniversitiesByCountry:', error);
    
    // Always return some data even on unexpected errors
    return res.status(200).json([
      { name: 'National University', id: 'uni_default_1' },
      { name: 'Technical University', id: 'uni_default_2' },
      { name: 'Regional University', id: 'uni_default_3' },
      { name: 'Central University', id: 'uni_default_4' },
      { name: 'International University', id: 'uni_default_5' }
    ]);
  }
}; 