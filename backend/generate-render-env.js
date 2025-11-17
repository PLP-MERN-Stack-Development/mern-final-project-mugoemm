#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  line = line.trim();
  
  // Skip comments and empty lines
  if (!line || line.startsWith('#')) return;
  
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=').trim();
  
  if (key && value) {
    envVars[key] = value;
  }
});

// Production overrides
const productionEnvVars = {
  ...envVars,
  NODE_ENV: 'production',
  PORT: '10000', // Render uses port 10000
  FRONTEND_URL: 'YOUR_VERCEL_URL_HERE', // Update this after Vercel deployment
};

console.log('\n=================================================');
console.log('RENDER ENVIRONMENT VARIABLES');
console.log('=================================================\n');
console.log('Copy and paste these into Render dashboard:\n');

Object.entries(productionEnvVars).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log('\n=================================================');
console.log('IMPORTANT NOTES:');
console.log('=================================================');
console.log('1. Update FRONTEND_URL with your Vercel URL after deployment');
console.log('2. For EMAIL_* variables, use production email service (Gmail/SendGrid)');
console.log('3. Make sure MONGO_URI points to your production database');
console.log('\n');

// Create a file for easy copy-paste
const outputPath = path.join(__dirname, 'render-env.txt');
const output = Object.entries(productionEnvVars)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync(outputPath, output);
console.log(`✓ Environment variables saved to: ${outputPath}\n`);
