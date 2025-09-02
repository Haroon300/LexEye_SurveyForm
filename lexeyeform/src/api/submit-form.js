export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error', 
      message: 'Method not allowed' 
    });
  }

  try {
    // Your Google Apps Script URL
    const scriptURL = "https://script.google.com/macros/s/AKfycbxy_jPdGcmcknxmS9kHt5mcG7BRXdBu2n50iJrF8KyAlsdBq8h8MqS_PGbswjrQmyeGRQ/exec";
    
    // Forward the request to Google Apps Script
    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    
    // Get the response text
    const responseText = await response.text();
    
    // Try to parse as JSON, if it fails, return the text
    try {
      const data = JSON.parse(responseText);
      res.status(200).json(data);
    } catch (e) {
      res.status(200).json({ 
        status: 'success', 
        message: 'Data submitted successfully',
        rawResponse: responseText 
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error: ' + error.message 
    });
  }
}

// Handle CORS preflight requests
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};