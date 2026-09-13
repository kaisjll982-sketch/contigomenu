import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconSvg = fs.readFileSync(path.resolve('public/icon.svg'));
const maskableSvg = fs.readFileSync(path.resolve('public/icon-maskable.svg'));

async function generate() {
  console.log('Generating PWA icons...');
  
  // 192x192
  await sharp(iconSvg)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 512x512
  await sharp(iconSvg)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 512x512 maskable
  await sharp(maskableSvg)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // apple-touch-icon.png 180x180
  await sharp(iconSvg)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // favicon.ico / favicon.png 64x64
  await sharp(iconSvg)
    .resize(64, 64)
    .png()
    .toFile(path.resolve('public/favicon.ico'));
  console.log('Generated favicon.ico');

  console.log('All icons generated successfully!');
}

generate().catch(err => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});
