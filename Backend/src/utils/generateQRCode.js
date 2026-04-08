import QRCode from 'qrcode';

/**
 * Generates a QR code from a given string (e.g., an item ID or URL)
 * and returns it as a base64-encoded PNG data URL.
 *
 * @param {string} data - The string to encode in the QR code
 * @returns {Promise<string>} - base64 data URL: "data:image/png;base64,..."
 */
const generateQRCode = async (data) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(String(data), {
      errorCorrectionLevel: 'H', // High error correction (30% restoration)
      type: 'image/png',
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 300,
    });
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error(`QR code generation failed: ${error.message}`);
  }
};

export default generateQRCode;
