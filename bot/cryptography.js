const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config({path : 'config/config.env'});

// Encrypt function
function encrypt(text, secretKey) {
    const iv = crypto.randomBytes(16); // Generate a random IV
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
}

// Decrypt function
function decrypt(encryptedText, secretKey) {
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex'); // Extract IV from encrypted text
    const encryptedData = encryptedText.slice(32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Example usage
const secretKey = process.env.KEY.padEnd(32, '\0'); // Pad with zeroes if shorter
const originalText = '44802f4b21dc26e3dc10d78f636e349230eac84e5db35482e1df9cd31fafe3bea9682a4ec377b2c36f675830ce9057423cae126bf8d29de3ef68cdd8759ce76533bd0f7f2bb1fb925cfe61e4afdb3228a0e53a518df772811f9f281109452603';

const decryptedText = decrypt(originalText, secretKey);
// console.log('Decrypted:', decryptedText);


// const encryptedText = encrypt(originalText, secretKey);
// console.log('Encrypted:', encryptedText);
// const decryptedText = decrypt(encryptedText, secretKey);
// console.log('Decrypted:', decryptedText);
module.exports.decryptedText = decryptedText;