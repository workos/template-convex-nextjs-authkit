const clientId = process.env.WORKOS_CLIENT_ID;

const authConfig = {
  providers: [
    {
      // WorkOS JWT configuration
      // Make sure to configure WORKOS_CLIENT_ID in your
      // Convex dashboard environment variables
      domain: `https://api.workos.com/user_management/${clientId}`,
      applicationID: clientId,
    },
  ],
};

export default authConfig;
