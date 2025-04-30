import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Fix email password by removing spaces
const fixedEmailPass = process.env.EMAIL_PASS.replace(/\s+/g, '');

// Log the changes
console.log('Original EMAIL_PASS:', process.env.EMAIL_PASS);
console.log('Fixed EMAIL_PASS:', fixedEmailPass);

// Set the fixed value
process.env.EMAIL_PASS = fixedEmailPass;

// Test if the value has been updated
console.log('Updated EMAIL_PASS in process.env:', process.env.EMAIL_PASS);

console.log('Environment variables have been updated. Run your application to apply these changes.'); 