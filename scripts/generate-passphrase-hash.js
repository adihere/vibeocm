/**
 * Utility script to generate a bcrypt hash for a passphrase
 *
 * Usage:
 * 1. Run: node scripts/generate-passphrase-hash.js YOUR_PASSPHRASE
 * 2. Copy the generated hash to your .env file as HASHED_PASSPHRASE
 */

const bcrypt = require("bcryptjs")

async function generateHash() {
  // Get the passphrase from command line arguments
  const passphrase = process.argv[2]

  if (!passphrase) {
    console.error("Please provide a passphrase as an argument")
    console.error("Example: node scripts/generate-passphrase-hash.js YOUR_PASSPHRASE")
    process.exit(1)
  }

  // Generate a salt with cost factor 12
  const salt = await bcrypt.genSalt(12)

  // Hash the passphrase with the salt
  const hash = await bcrypt.hash(passphrase, salt)

  console.log("Generated bcrypt hash (cost factor 12):")
  console.log(hash)
  console.log("\nAdd this to your .env file as:")
  console.log(`HASHED_PASSPHRASE="${hash}"`)
}

generateHash().catch(console.error)

