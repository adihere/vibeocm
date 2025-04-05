/**
 * Utility script to generate a bcrypt hash for a passphrase
 *
 * Usage:
 * 1. Run: node scripts/generate-passphrase-hash.js YOUR_PASSPHRASE
 * 2. Copy the generated hash to your .env file as HASHED_PASSPHRASE
 */

const bcrypt = require("bcryptjs")
const fs = require("fs")
const path = require("path")

async function generateHash() {
  // Get the passphrase from command line arguments
  const passphrase = process.argv[2]

  if (!passphrase) {
    console.error("Please provide a passphrase as an argument")
    console.error("Example: node scripts/generate-passphrase-hash.js YOUR_PASSPHRASE")
    process.exit(1)
  }

  try {
    // Generate a salt with cost factor 12
    const salt = await bcrypt.genSalt(12)

    // Hash the passphrase with the salt
    const hash = await bcrypt.hash(passphrase, salt)

    console.log("Generated bcrypt hash (cost factor 12):")
    console.log(hash)
    
    // Create or update .env file
    const envPath = path.join(__dirname, "../.env")
    const envContent = `HASHED_PASSPHRASE="${hash}"\n`

    fs.writeFileSync(envPath, envContent, { flag: 'w' })

    console.log("\nHash has been automatically added to .env file at:")
    console.log(envPath)
    console.log("\nYou can now use this passphrase for authentication.")
  } catch (error) {
    console.error("Error generating hash:", error)
    process.exit(1)
  }
}

generateHash().catch(console.error)

