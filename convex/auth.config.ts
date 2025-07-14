const authConfig = {
  providers: [
    {
      domain: `https://api.workos.com/user_management/${process.env.WORKOS_CLIENT_ID}`,
      applicationID: process.env.WORKOS_CLIENT_ID,
    },
  ],
};

export default authConfig;
