module.exports = {
  apps : [{
    name   : "itpro-whatsapp",
    script : "npm run dev",
    env_production: {
        NODE_ENV: "production",
        PORT: 14045
     },
     env_development: {
        NODE_ENV: "development",
        PORT: 3000
     }
  }]
}
