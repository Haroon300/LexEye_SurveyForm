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
    
    // Convert the data to URL-encoded format
    const formData = new URLSearchParams();
    for (const key in req.body) {
      if (req.body[key]) {
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
    
    // Try to parse as JSON, if it fails, return the text
    try {
      const data = JSON.parse(responseText);
      res.status(200).json(data);
    } catch (e) {
      // If it's not JSON, check if it contains success indicators
      if (responseText.includes('success') || response.status === 200) {
        res.status(200).json({ 
          status: 'success', 
          message: 'Data submitted successfully' 
        });
      } else {
        res.status(500).json({ 
          status: 'error', 
          message: 'Unexpected response from server: ' + responseText.substring(0, 100)
        });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error: ' + error.message 
    });
  }
}