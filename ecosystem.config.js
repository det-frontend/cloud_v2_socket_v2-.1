module.exports = {
    apps: [
      {
        name: 'se-sai',
        script: 'node dist/app.js', // Change this to the entry point of your application
        watch: false, // Watch files for changes (optional)
        max_memory_restart: '1G', // Restart if it exceeds this memory
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  