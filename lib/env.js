// Environment variable utility module for NextAuth v5 beta integration

// Required environment variables
const requiredEnvVars = ["MONGODB_URI", "AUTH_SECRET"];

// Optional environment variables with their default values
const optionalEnvVars = {
  NEXTAUTH_URL:
    process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000",
  AUTH_TRUST_HOST: "true",
};

/**
 * Validates the required environment variables
 * @returns {boolean} - Whether all required variables are set
 */
export function validateEnv() {
  let isValid = true;
  const missingVars = [];

  // Check required env vars
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
      isValid = false;
    }
  }

  // Report any missing variables
  if (missingVars.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missingVars.join(", ")}`
    );
    console.error("Please check your .env.local file or environment settings.");
  } else {
    console.log("✅ All required environment variables are set.");
  }

  // Set defaults for optional variables
  for (const [envVar, defaultValue] of Object.entries(optionalEnvVars)) {
    if (!process.env[envVar] && defaultValue !== undefined) {
      process.env[envVar] = defaultValue;
      console.log(`ℹ️ Setting default for ${envVar}: ${defaultValue}`);
    }
  }

  return isValid;
}

// Validate on import to catch issues early
validateEnv();
