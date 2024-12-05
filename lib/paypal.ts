import axios from "axios";

export async function getPayPalAccessToken() {
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;
  const PAYPAL_API = process.env.PAYPAL_API || "https://api-m.sandbox.paypal.com";

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: PAYPAL_CLIENT_ID,
          password: PAYPAL_SECRET,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching PayPal access token:", error);
    throw new Error("Failed to authenticate with PayPal");
  }
}
