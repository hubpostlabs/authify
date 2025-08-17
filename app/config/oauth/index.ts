type Providers = "google" | "microsoft" | "twitter"
const getOAuth = async (provider: Providers, redirectUri: string) => {
    if (provider === "google") {
        const { OAuth2Client, AuthClient } = await import("google-auth-library");
        const client_id = process.env.GOOGLE_CLIENT_ID;
        const client_secret = process.env.GOOGLE_CLIENT_SECRET;
        console.log(client_id)
        return new OAuth2Client ({client_id, client_secret, redirectUri})
    }

}

export  { getOAuth }