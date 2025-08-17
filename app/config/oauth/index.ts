type Providers = "google" | "microsoft" | "twitter"
const getOAuth = async (provider: Providers, redirectUri: string) => {
    if (provider === "google") {
        const { OAuth2Client } = await import("google-auth-library");
        const client_id = process.env.GOOGLE_CLIENT_ID;
        const client_secret = process.env.GOOGLE_CLIENT_SECRET;
        return new OAuth2Client ({client_id, client_secret, redirectUri})
    }
}

export  { getOAuth }