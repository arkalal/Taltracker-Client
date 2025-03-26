// For testing environment variable loading
require("dotenv").config({ path: ".env.local" });

console.log("Environment variables check:");
console.log("--------------------------");
console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI ? "Defined ✓" : "Not defined ✗"
);
console.log(
  "AUTH_SECRET:",
  process.env.AUTH_SECRET ? "Defined ✓" : "Not defined ✗"
);
console.log(
  "NEXTAUTH_URL:",
  process.env.NEXTAUTH_URL ? "Defined ✓" : "Not defined ✗"
);
console.log(
  "AUTH_TRUST_HOST:",
  process.env.AUTH_TRUST_HOST ? "Defined ✓" : "Not defined ✗"
);
console.log("--------------------------");
