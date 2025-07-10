const fs = require('fs');
const path = require('path');

// Icon sizes for PWA
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

function createPlaceholderIcon(size) {
    // Create a simple SVG icon with a health theme
    const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.2}"/>
  <circle cx="${size * 0.5}" cy="${size * 0.4}" r="${size * 0.15}" fill="white" opacity="0.9"/>
  <path d="M ${size * 0.35} ${size * 0.6} L ${size * 0.5} ${size * 0.75} L ${size * 0.65} ${size * 0.6}" 
        stroke="white" stroke-width="${size * 0.08}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="${size * 0.5}" y="${size * 0.85}" text-anchor="middle" fill="white" 
        font-family="Arial, sans-serif" font-size="${size * 0.12}" font-weight="bold">HJ</text>
</svg>`;

    return svg;
}

function createPNGFromSVG(svg, size, outputPath) {
    // For now, we'll create SVG files since we don't have image processing libraries
    // In a real scenario, you'd convert SVG to PNG using a library like sharp
    fs.writeFileSync(outputPath.replace('.png', '.svg'), svg);
    console.log(`Created ${path.basename(outputPath.replace('.png', '.svg'))}`);
}

async function generateIcons() {
    const outputDir = path.join(__dirname, '../public/icons');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        for (const size of iconSizes) {
            const svg = createPlaceholderIcon(size);
            const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
            createPNGFromSVG(svg, size, outputPath);
        }

        // Create favicon
        const faviconSvg = createPlaceholderIcon(32);
        fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), faviconSvg);
        console.log('Created favicon.svg');

        console.log('PWA icons generated successfully!');
        console.log('Note: These are SVG files. For production, convert them to PNG using an image editor or sharp library.');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

generateIcons(); 