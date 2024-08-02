module.exports = {
    apps: [
      {
        name: 'se-sai',
        script: 'node_modules/.bin/ts-node-dev --respawn --transpile-only src/app.ts',
        node_args: "--max_old_space_size=4096",
        watch: true, // Watch files for changes (optional)
        instance: 1,
        max_memory_restart: '2G', // Restart if it exceeds this memory
        autorestart: true,
        cron_restart: '0 0 * * *',
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  