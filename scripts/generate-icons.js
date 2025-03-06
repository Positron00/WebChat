const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertSvgToPng() {
  const iconSizes = [192, 512];
  const publicDir = path.join(process.cwd(), 'public');
  const iconsDir = path.join(publicDir, 'icons');
  
  // Create icons directory if it doesn't exist
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  for (const size of iconSizes) {
    const svgPath = path.join(iconsDir, `icon-${size}.svg`);
    const pngPath = path.join(iconsDir, `icon-${size}.png`);
    
    if (fs.existsSync(svgPath)) {
      console.log(`Converting icon-${size}.svg to PNG...`);
      
      try {
        await sharp(svgPath)
          .resize(size, size)
          .png()
          .toFile(pngPath);
          
        console.log(`✓ Successfully created icon-${size}.png`);
      } catch (error) {
        console.error(`Error converting icon-${size}.svg:`, error);
      }
    } else {
      console.error(`SVG file not found: icon-${size}.svg`);
    }
  }
}

convertSvgToPng().catch(console.error); 