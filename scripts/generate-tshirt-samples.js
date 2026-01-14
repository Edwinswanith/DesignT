const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyCRXnDYdjzwBwt489drnjf8CVWpZ7jM5UI';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// T-shirt designs to generate
const TSHIRT_DESIGNS = [
  {
    id: 1,
    filename: 'family-portrait.png',
    color: 'white',
    prompt: 'A plain white t-shirt on a clean white background, product photography style, the t-shirt has a cute animated Pixar-style family portrait design printed on the chest area showing a happy family of 4 (parents and 2 kids) in 3D cartoon style. Professional product shot, soft lighting, no wrinkles.'
  },
  {
    id: 2,
    filename: 'birthday-celebration.png',
    color: 'black',
    prompt: 'A plain black t-shirt on a clean gray background, product photography style, the t-shirt has a photorealistic birthday celebration design printed on the chest showing colorful balloons, confetti, and "Happy Birthday" text in elegant gold lettering. Professional product shot, soft lighting.'
  },
  {
    id: 3,
    filename: 'wedding-memory.png',
    color: 'navy',
    prompt: 'A plain navy blue t-shirt on a clean light background, product photography style, the t-shirt has an artistic watercolor-style wedding design printed on the chest showing a romantic couple silhouette with floral decorations in soft pink and white tones. Professional product shot, soft lighting.'
  },
  {
    id: 4,
    filename: 'pet-portrait.png',
    color: 'gray',
    prompt: 'A plain heather gray t-shirt on a clean white background, product photography style, the t-shirt has a cute anime-style cat portrait design printed on the chest, showing an adorable orange tabby cat with big sparkly eyes in Japanese anime art style. Professional product shot, soft lighting.'
  },
  {
    id: 5,
    filename: 'vintage-travel.png',
    color: 'cream',
    prompt: 'A plain cream/off-white t-shirt on a clean background, product photography style, the t-shirt has a vintage retro travel poster design printed on the chest showing a scenic mountain landscape with "Adventure Awaits" text in distressed vintage typography. Professional product shot, soft lighting.'
  }
];

async function generateTshirtImage(design) {
  console.log(`\nGenerating: ${design.filename}...`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: design.prompt }]
        }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
          imageConfig: {
            aspectRatio: '3:4'  // Portrait orientation for t-shirt
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Error for ${design.filename}:`, data.error?.message || 'Unknown error');
      return null;
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);

    if (!imagePart?.inlineData) {
      console.error(`No image generated for ${design.filename}`);
      const textPart = parts.find(p => p.text);
      if (textPart) console.log('Response:', textPart.text.slice(0, 200));
      return null;
    }

    // Save image to file
    const outputPath = path.join(__dirname, '..', 'public', 'samples', design.filename);
    const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
    fs.writeFileSync(outputPath, imageBuffer);

    console.log(`Saved: ${design.filename} (${(imageBuffer.length / 1024).toFixed(1)} KB)`);
    return design.filename;

  } catch (error) {
    console.error(`Exception for ${design.filename}:`, error.message);
    return null;
  }
}

async function main() {
  // Create samples directory if it doesn't exist
  const samplesDir = path.join(__dirname, '..', 'public', 'samples');
  if (!fs.existsSync(samplesDir)) {
    fs.mkdirSync(samplesDir, { recursive: true });
    console.log('Created directory: public/samples');
  }

  console.log('Generating 5 T-shirt mockup images...');
  console.log('This may take a minute...\n');

  const results = [];

  // Generate images sequentially to avoid rate limits
  for (const design of TSHIRT_DESIGNS) {
    const result = await generateTshirtImage(design);
    results.push({ ...design, success: !!result });

    // Small delay between requests
    if (design.id < TSHIRT_DESIGNS.length) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n--- Summary ---');
  results.forEach(r => {
    console.log(`${r.success ? '✅' : '❌'} ${r.filename}`);
  });

  const successCount = results.filter(r => r.success).length;
  console.log(`\nGenerated ${successCount}/${TSHIRT_DESIGNS.length} images`);
}

main().catch(console.error);
