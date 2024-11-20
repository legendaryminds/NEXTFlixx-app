require('dotenv').config()
const fetch = require('node-fetch')

module.exports = async (req, res) => {
  const endpoint = req.query.endpoint // Read endpoint from query parameters
  const queryParams = req.query // Capture additional query parameters

  // Remove the `endpoint` key to avoid duplication
  delete queryParams.endpoint

  const query = new URLSearchParams(queryParams).toString()
  const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${process.env.API_KEY}&${query}`

  try {
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
