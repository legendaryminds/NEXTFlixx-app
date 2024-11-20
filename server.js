const isProduction = process.env.NODE_ENV === 'production'
if (isProduction) {
  console.log('Running in production mode')
} else {
  console.log('Running in development mode')
}

require('dotenv').config() // Load .env variables
const express = require('express')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5000

// Debug: Verify that the API key is loaded correctly
console.log('Loaded API Key:', process.env.API_KEY)

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')))

// Proxy route to handle API requests
app.get('/api/*', async (req, res) => {
  const endpoint = req.params[0] // Capture everything after /api/
  const queryParams = req.query // Capture additional query parameters
  const query = new URLSearchParams(queryParams).toString()
  const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${process.env.API_KEY}&${query}`

  console.log('Fetching URL:', url) // Debugging URL

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Error fetching data from TMDB:', error.message)
    res.status(500).json({ error: 'Failed to fetch data from TMDB' })
  }
})

// Start the server
if (!isProduction) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}
