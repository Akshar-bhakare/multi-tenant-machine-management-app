// ============================================
// API Key Generation
// ============================================
// Simple, secure key generation for client and machine API keys.

// Generate a random string of given length using crypto
function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length);
}

// Generate a client API key: cl_<random 32-char hex string>
export function generateClientApiKey(): string {
  return `cl_${generateRandomString(32)}`;
}

// Generate a machine API key: mc_<random 32-char hex string>
export function generateMachineApiKey(): string {
  return `mc_${generateRandomString(32)}`;
}
