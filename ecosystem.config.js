module.exports = {
    apps: [
      {
        name: 'se-sai',
        script: 'dist/app.js', // Path to the compiled JavaScript entry point
        watch: false, // Disable watching since we're running the compiled JavaScript files
        max_memory_restart: '500M', // Restart the application if it exceeds 500MB memory usage
        env: {
          NODE_ENV: 'development', // Environment variables for development
        },
        env_production: {
          NODE_ENV: 'production', // Environment variables for production
        },
      },
    ],
  };