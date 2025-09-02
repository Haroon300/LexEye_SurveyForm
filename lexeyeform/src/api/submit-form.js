// api/submit-form.js
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
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
    
    // Convert the data to URL-encoded format
    const formData = new URLSearchParams();
    for (const key in req.body) {
      if (req.body[key] !== undefined && req.body[key] !== null) {
        formData.append(key, req.body[key]);
      }
    }
    
    // Forward the request to Google Apps Script
    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formData.toString(),
    });
    
    // Get the response text
    const responseText = await response.text();
    
    // Try to parse as JSON, if it fails, check if it's a success message
    try {
      const data = JSON.parse(responseText);
      res.status(200).json(data);
    } catch (e) {
      // If it's not JSON but the response was successful
      if (response.ok) {
        res.status(200).json({ 
          status: 'success', 
          message: 'Data submitted successfully' 
        });
      } else {
        res.status(500).json({ 
          status: 'error', 
          message: 'Unexpected response from server' 
        });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
}