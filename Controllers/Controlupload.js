const fs = require('fs').promises;
const path = require('path');
const { uploadFileToCloudinary } = require('../Services/Cloudserv');
const { parseCSVFile } = require('../Services/Csvparser');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.resolve(req.file.path);
    console.log(`File received: ${filePath}`);

    const cloudinaryResult = await uploadFileToCloudinary(filePath);
    console.log('Cloudinary Upload Success:', cloudinaryResult.secure_url);

    const csvData = await parseCSVFile(filePath);
    console.log('CSV Parsing Success:', csvData.length, 'records parsed');

    await fs.unlink(filePath);
    console.log('File deleted from server:', filePath);

    res.status(200).json({
      message: 'File uploaded and parsed successfully',
      cloudinary_url: cloudinaryResult.secure_url,
      data: csvData,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'File upload or parsing failed' });
  }
};

module.exports = { uploadFile };
