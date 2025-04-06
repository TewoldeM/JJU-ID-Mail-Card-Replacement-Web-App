// app/api/auth/refresh-token/route.ts
import { NextApiRequest, NextApiResponse } from "next";
import { jwtVerify, importJWK } from "jose";
import generateAccessToken from "../utils/route";

const refreshTokenRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const refreshToken = req.headers.authorization?.split(" ")[1];

  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "secret";

    if (!jwtSecret) {
      throw new Error("JWT secret is not set");
    }

    const key = await importJWK({ kty: 'oct', k: jwtSecret }, 'HS256');

    const verifiedToken = await jwtVerify(refreshToken, key, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });

    // Generate a new access token
    const newAccessToken = await generateAccessToken(verifiedToken.payload);

    return res.status(200).json({ token: newAccessToken });
  } catch (err) {
    console.error("Error refreshing token:", err);
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};

export default refreshTokenRoute;