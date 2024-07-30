module.exports = {
    apps: [
      {
        name: 'se-sai',
        script: 'node dist/app.js', // Change this to the entry point of your application
        node_args: '--max-old-space-size=4098', // Increase memory limit
        watch: false, // Watch files for changes (optional)
        max_memory_restart: '4G', // Restart if it exceeds this memory
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  