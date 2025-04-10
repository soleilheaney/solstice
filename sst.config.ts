// Disable the next line's warning since it's part of the SST platform
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "solstice",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: input.stage === "production" ? "soleil-production" : "soleil-dev"
        }
      }
    };
  },
  async run(input) {
    const vpc = new sst.aws.Vpc("SolsticeVpc");
    
    // Create a secret for database password in production
    const dbPassword = input?.stage === "production" 
      ? new sst.Secret("PostgresPassword")
      : undefined;
    
    const postgres = new sst.aws.Postgres("SolsticeDB", {
      vpc,
      version: "17.4", // Latest GA version
      storage: input?.stage === "production" ? "50 GB" : "20 GB",
      instance: input?.stage === "production" ? "t4g.micro" : undefined, // Small, cost-effective instance
      username: "postgres",
      password: input?.stage === "production" ? dbPassword?.value : undefined,
      database: "solstice",
      multiAz: input?.stage === "production", // High availability for production
      proxy: input?.stage === "production", // Connection pooling with RDS Proxy
      transform: {
        parameterGroup: (args) => ({
          ...args,
          parameters: [
            ...args.parameters,
            {
              name: "max_connections", 
              value: "100", // Sufficient for small user base
            },
            {
              name: "shared_buffers",
              value: "128MB", // Appropriate for small workload
            }
          ]
        })
      },
      dev: {
        username: "postgres",
        password: "postgres",
        database: "solstice",
        host: "localhost",
        port: 5432
      }
    });
    
    new sst.aws.TanStackStart("MyWeb", {
      link: [postgres]
    });
  },
});