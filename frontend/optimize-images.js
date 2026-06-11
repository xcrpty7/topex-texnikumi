const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDirs = [
  path.join(__dirname, 'public/assets/images'),
  path.join(__dirname, 'public/assets/famali-photo'),
  path.join(__dirname, 'public/assets/Ustozlar')
];

const processImages = async () => {
  for (const dir of inputDirs) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir);

    for (const file of files) {
      if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

      const inputPath = path.join(dir, file);
      const tempPath = path.join(dir, 'temp_' + file);
      
      console.log(`Processing: ${file}`);
      
      try {
        await sharp(inputPath)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 80, progressive: true })
          .toFile(tempPath);
          
        fs.unlinkSync(inputPath);
        fs.renameSync(tempPath, inputPath);
        console.log(`Optimized: ${file}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    }
  }
  console.log('All images optimized!');
};

processImages();
