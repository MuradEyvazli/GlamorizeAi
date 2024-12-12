import jwt from 'jsonwebtoken';

export const generateJWT = (ak, sk) => {
  try {
    // Generate current timestamp in seconds
    const now = Math.floor(Date.now() / 1000);

    // Define payload with the required claims
    const payload = {
      iss: ak, // Issuer
      nbf: now - 5, // Not valid before (current time - 5 seconds)
      exp: now + 1800, // Expiry time (current time + 30 minutes)
    };

    // Define header (optional, defaults to HS256)
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    // Sign the token
    return jwt.sign(payload, sk, { header });
  } catch (error) {
    console.error('Error generating JWT:', error.message);
    throw new Error('JWT generation failed');
  }
};
