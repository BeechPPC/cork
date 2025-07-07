#!/usr/bin/env node

/**
 * Firebase Migration Script for Cork Wine App
 *
 * This script helps migrate from Clerk + Neon to Firebase Auth + Firestore
 * Run this script after setting up your Firebase project and environment variables
 */

const fs = require('fs');
const path = require('path');

console.log('🍷 Starting Firebase Migration for Cork Wine App...\n');

// Check if Firebase dependencies are installed
function checkDependencies() {
  console.log('📦 Checking dependencies...');

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasFirebase =
    packageJson.dependencies?.firebase || packageJson.devDependencies?.firebase;

  if (!hasFirebase) {
    console.log(
      '❌ Firebase dependency not found. Please run: npm install firebase firebase-tools'
    );
    process.exit(1);
  }

  console.log('✅ Firebase dependencies found');
}

// Check environment variables
function checkEnvironment() {
  console.log('\n🔧 Checking environment variables...');

  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missingVars = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\nPlease add these to your .env file');
    process.exit(1);
  }

  console.log('✅ All Firebase environment variables found');
}

// Create backup of current auth components
function createBackups() {
  console.log('\n💾 Creating backups...');

  const filesToBackup = [
    'client/src/components/sign-in-button.tsx',
    'client/src/components/user-button.tsx',
    'client/src/components/auth-wrapper.tsx',
    'client/src/hooks/useAuth.ts',
    'client/src/lib/clerk.ts',
  ];

  filesToBackup.forEach(file => {
    if (fs.existsSync(file)) {
      const backupPath = `${file}.backup`;
      fs.copyFileSync(file, backupPath);
      console.log(`✅ Backed up ${file}`);
    }
  });
}

// Update package.json scripts
function updateScripts() {
  console.log('\n📝 Updating package.json scripts...');

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  if (!packageJson.scripts.emulators) {
    packageJson.scripts.emulators = 'firebase emulators:start';
  }

  if (!packageJson.scripts['deploy:rules']) {
    packageJson.scripts['deploy:rules'] =
      'firebase deploy --only firestore:rules,storage';
  }

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅ Added Firebase scripts to package.json');
}

// Check if Firebase config files exist
function checkFirebaseConfig() {
  console.log('\n🔍 Checking Firebase configuration...');

  const requiredFiles = [
    'firebase.json',
    'firestore.rules',
    'storage.rules',
    'firestore.indexes.json',
    'client/src/lib/firebase.ts',
    'client/src/lib/auth.ts',
    'client/src/lib/database.ts',
    'client/src/lib/storage.ts',
  ];

  const missingFiles = [];

  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  });

  if (missingFiles.length > 0) {
    console.log('❌ Missing Firebase configuration files:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
    console.log('\nPlease ensure all Firebase configuration files are created');
    process.exit(1);
  }

  console.log('✅ All Firebase configuration files found');
}

// Generate migration checklist
function generateChecklist() {
  console.log('\n📋 Migration Checklist:');
  console.log('\n1. ✅ Dependencies installed');
  console.log('2. ✅ Environment variables configured');
  console.log('3. ✅ Backups created');
  console.log('4. ✅ Package scripts updated');
  console.log('5. ✅ Firebase configuration files created');
  console.log('\nNext steps:');
  console.log('6. 🔄 Update authentication components');
  console.log('7. 🔄 Update header component');
  console.log('8. 🔄 Update API request functions');
  console.log('9. 🔄 Update database operations');
  console.log('10. 🔄 Update file upload operations');
  console.log('11. 🔄 Test all functionality');
  console.log('12. 🔄 Deploy security rules');
  console.log('13. 🔄 Remove Clerk dependencies (optional)');

  console.log('\n📖 See FIREBASE_MIGRATION_GUIDE.md for detailed instructions');
}

// Main migration function
function runMigration() {
  try {
    checkDependencies();
    checkEnvironment();
    createBackups();
    updateScripts();
    checkFirebaseConfig();
    generateChecklist();

    console.log('\n🎉 Migration preparation complete!');
    console.log('\nNext: Follow the migration guide to update your components');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration();
