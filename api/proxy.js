require('dotenv').config() // Load .env variables
const fetch = require('node-fetch')

module.exports = async (req, res) => {
  // Extract the API endpoint from the request path
  const endpoint = req.url.replace('/api/', '') // Remove `/api/` from the path
  const queryParams = req.query // Capture any additional query parameters
  const query = new URLSearchParams(queryParams).toString()
  const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${process.env.API_KEY}&${query}`

  // Log debugging information
  console.log('Running in production mode')
  console.log('Loaded API Key:', process.env.API_KEY ? '******' : 'Not defined')
  console.log('Fetching URL:', url)

  try {
    // Fetch data from the TMDB API
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }
    const data = await response.json()

    // Send the JSON response back to the client
    res.status(200).json(data)
  } catch (error) {
    // Log errors and send an error response
    console.error('Error fetching data from TMDB:', error.message)
    res.status(500).json({ error: 'Failed to fetch data from TMDB' })
  }
}
