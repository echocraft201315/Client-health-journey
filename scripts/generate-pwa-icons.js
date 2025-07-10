const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes for PWA
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
    const inputPath = path.join(__dirname, '../public/logo.png'); // Your base logo
    const outputDir = path.join(__dirname, '../public/icons');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        for (const size of iconSizes) {
            await sharp(inputPath)
                .resize(size, size)
                .png()
                .toFile(path.join(outputDir, `icon-${size}x${size}.png`));

            console.log(`Generated icon-${size}x${size}.png`);
        }

        // Generate favicon
        await sharp(inputPath)
            .resize(32, 32)
            .png()
            .toFile(path.join(__dirname, '../public/favicon.ico'));

        console.log('Generated favicon.ico');
        console.log('PWA icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

generateIcons(); 