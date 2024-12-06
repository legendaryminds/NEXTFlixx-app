require('dotenv').config()
const fetch = require('node-fetch')

module.exports = async (req, res) => {
  try {
    const endpoint = req.query.endpoint // Read endpoint from query parameters
    const queryParams = { ...req.query } // Clone query parameters

    // Remove `endpoint` to avoid duplicating it in the query
    delete queryParams.endpoint

    // Build the query string
    const query = new URLSearchParams(queryParams).toString()

    // Construct the TMDB API URL
    const url = `https://api.themoviedb.org/3/${endpoint}${
      endpoint.includes('?') ? '&' : '?'
    }api_key=${process.env.API_KEY}&${query}`

    // Debugging: Log the full API URL
    console.log(`TMDB API Request URL: ${url}`)

    // Fetch data from TMDB
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching data from TMDB:', error.message)
    res.status(500).json({ error: 'Failed to fetch data from TMDB' })
  }
}
