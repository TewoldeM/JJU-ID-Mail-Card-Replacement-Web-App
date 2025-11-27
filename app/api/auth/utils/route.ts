import { JWTPayload, SignJWT } from "jose";

const generateAccessToken = async (payload: JWTPayload | undefined) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtIssuer = process.env.JWT_ISSUER;
  const jwtAudience = process.env.JWT_AUDIENCE;

  if (!jwtSecret || !jwtIssuer || !jwtAudience) {
    throw new Error("Required environment variables (JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE) are not set.");
  }

  const secret = new TextEncoder().encode(jwtSecret);

  const accessToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(jwtIssuer)
    .setAudience(jwtAudience)
    .setExpirationTime("24h") // Adjust the expiration time as needed
    .sign(secret);

  return accessToken;
};

export default generateAccessToken;