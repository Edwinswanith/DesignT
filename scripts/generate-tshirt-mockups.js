const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyCRXnDYdjzwBwt489drnjf8CVWpZ7jM5UI';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Blank T-shirt mockups for each color
const TSHIRT_MOCKUPS = [
  {
    id: 'midnight-black',
    filename: 'tshirt-black.png',
    prompt: 'A plain black t-shirt mockup on a transparent or very light gray background. Product photography style, front view, perfectly centered, no wrinkles, no design on the shirt - completely blank. Professional e-commerce product shot with soft studio lighting. The t-shirt should be a classic crew neck style.'
  },
  {
    id: 'pure-white',
    filename: 'tshirt-white.png',
    prompt: 'A plain white t-shirt mockup on a light gray background. Product photography style, front view, perfectly centered, no wrinkles, no design on the shirt - completely blank. Professional e-commerce product shot with soft studio lighting. The t-shirt should be a classic crew neck style.'
  },
  {
    id: 'silver-grey',
    filename: 'tshirt-grey.png',
    prompt: 'A plain heather gray t-shirt mockup on a white background. Product photography style, front view, perfectly centered, no wrinkles, no design on the shirt - completely blank. Professional e-commerce product shot with soft studio lighting. The t-shirt should be a classic crew neck style.'
  },
  {
    id: 'warm-beige',
    filename: 'tshirt-beige.png',
    prompt: 'A plain beige/tan colored t-shirt mockup on a white background. Product photography style, front view, perfectly centered, no wrinkles, no design on the shirt - completely blank. Professional e-commerce product shot with soft studio lighting. The t-shirt should be a classic crew neck style.'
  },
  {
    id: 'cream',
    filename: 'tshirt-cream.png',
    prompt: 'A plain cream/off-white colored t-shirt mockup on a light gray background. Product photography style, front view, perfectly centered, no wrinkles, no design on the shirt - completely blank. Professional e-commerce product shot with soft studio lighting. The t-shirt should be a classic crew neck style.'
  }
];

async function generateMockup(mockup) {
  console.log(`\nGenerating: ${mockup.filename}...`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: mockup.prompt }]
        }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
          imageConfig: {
            aspectRatio: '3:4'
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Error for ${mockup.filename}:`, data.error?.message || 'Unknown error');
      return null;
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);

    if (!imagePart?.inlineData) {
      console.error(`No image generated for ${mockup.filename}`);
      return null;
    }

    const outputPath = path.join(__dirname, '..', 'public', 'mockups', mockup.filename);
    const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
    fs.writeFileSync(outputPath, imageBuffer);

    console.log(`✅ Saved: ${mockup.filename} (${(imageBuffer.length / 1024).toFixed(1)} KB)`);
    return mockup.filename;

  } catch (error) {
    console.error(`Exception for ${mockup.filename}:`, error.message);
    return null;
  }
}

async function main() {
  const mockupsDir = path.join(__dirname, '..', 'public', 'mockups');
  if (!fs.existsSync(mockupsDir)) {
    fs.mkdirSync(mockupsDir, { recursive: true });
    console.log('Created directory: public/mockups');
  }

  console.log('Generating 5 blank T-shirt mockups...');
  console.log('This may take a minute...\n');

  const results = [];

  for (const mockup of TSHIRT_MOCKUPS) {
    const result = await generateMockup(mockup);
    results.push({ ...mockup, success: !!result });

    if (mockup !== TSHIRT_MOCKUPS[TSHIRT_MOCKUPS.length - 1]) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n--- Summary ---');
  results.forEach(r => {
    console.log(`${r.success ? '✅' : '❌'} ${r.filename} (${r.id})`);
  });

  const successCount = results.filter(r => r.success).length;
  console.log(`\nGenerated ${successCount}/${TSHIRT_MOCKUPS.length} mockups`);
}

main().catch(console.error);
