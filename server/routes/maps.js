import express from 'express';

const router = express.Router();

// POST resolve a short Google Maps URL to get coordinates
router.post('/resolve-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Check if it's a short URL that needs resolution
    const isShortUrl = url.includes('goo.gl') || url.includes('maps.app.goo.gl');
    
    if (!isShortUrl) {
      return res.status(400).json({ error: 'Not a short URL' });
    }

    // Follow redirects to get the final URL
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    });

    const finalUrl = response.url;
    
    // Extract coordinates from the final URL
    const coords = extractCoordsFromUrl(finalUrl);
    
    if (coords) {
      res.json({ 
        success: true, 
        coords,
        finalUrl 
      });
    } else {
      res.json({ 
        success: false, 
        error: 'Could not extract coordinates',
        finalUrl 
      });
    }
  } catch (error) {
    console.error('URL resolution error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to extract coordinates from URL
function extractCoordsFromUrl(url) {
  if (!url) return null;

  try {
    // Pattern 1: @lat,lng format
    const atPattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const atMatch = url.match(atPattern);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // Pattern 2: place/Name/@lat,lng format
    const placePattern = /place\/[^/]+\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const placeMatch = url.match(placePattern);
    if (placeMatch) {
      return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };
    }

    // Pattern 3: ?q=lat,lng format
    const qPattern = /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const qMatch = url.match(qPattern);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }

    // Pattern 4: ll= parameter
    const llPattern = /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const llMatch = url.match(llPattern);
    if (llMatch) {
      return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
    }

    // Pattern 5: data=...!3d{lat}!4d{lng} format (encoded in data parameter)
    const dataPattern = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/;
    const dataMatch = url.match(dataPattern);
    if (dataMatch) {
      return { lat: parseFloat(dataMatch[1]), lng: parseFloat(dataMatch[2]) };
    }

  } catch (e) {
    console.warn('Failed to parse URL:', e);
  }

  return null;
}

export default router;
