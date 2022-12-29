module.exports = {
  apps: [
    {
      name: "little-notes",
      script: "npm",
      automation: false,
      args: "run pm2",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
}