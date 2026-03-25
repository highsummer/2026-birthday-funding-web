/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "birthday-funding",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: { aws: { region: "ap-northeast-2" } },
    };
  },
  async run() {
    const firebaseServiceAccount = new sst.Secret("FirebaseServiceAccount");
    const adminPassword = new sst.Secret("AdminPassword");

    const secrets = [firebaseServiceAccount, adminPassword];

    const api = new sst.aws.ApiGatewayV2("Api", {
      cors: {
        allowOrigins: ["http://localhost:5173", "https://birthday.yoonha.dev"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type"],
      },
    });

    api.route("GET /api/funding/summary", {
      handler: "packages/functions/src/funding-summary.handler",
      link: secrets,
    });
    api.route("POST /api/funding", {
      handler: "packages/functions/src/funding-add.handler",
      link: secrets,
    });
    api.route("DELETE /api/funding", {
      handler: "packages/functions/src/funding-delete.handler",
      link: secrets,
    });
    api.route("GET /api/guestbook", {
      handler: "packages/functions/src/guestbook-list.handler",
      link: secrets,
    });
    api.route("POST /api/guestbook", {
      handler: "packages/functions/src/guestbook-create.handler",
      link: secrets,
    });
    api.route("PUT /api/guestbook/{id}", {
      handler: "packages/functions/src/guestbook-update.handler",
      link: secrets,
    });
    api.route("DELETE /api/guestbook/{id}", {
      handler: "packages/functions/src/guestbook-delete.handler",
      link: secrets,
    });

    const site = new sst.aws.StaticSite("Site", {
      build: {
        command: "npm run build",
        output: "dist",
      },
      domain: "birthday.yoonha.dev",
      environment: {
        VITE_API_URL: api.url,
        VITE_BANK_ACCOUNT: process.env.VITE_BANK_ACCOUNT || "",
      },
    });

    return { apiUrl: api.url, siteUrl: site.url };
  },
});
