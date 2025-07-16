const clientId = process.env.WORKOS_CLIENT_ID;
const authConfig = {
  providers: [
    {
      domain: `https://api.workos.com/user_management/${clientId}`,
      applicationID: clientId,
    },
  ],
};

export default authConfig;
