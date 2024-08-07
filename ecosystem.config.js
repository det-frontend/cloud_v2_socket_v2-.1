module.exports = {
    apps: [
      {
        name: 'se-sai',
        script: 'node dist/app.js',
        node_args: "--max_old_space_size=4096",
        instance: 1,
        max_memory_restart: '2G',
        autorestart: true,
        watch: false,
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
        },
        log_date_format: 'YYYY-MM-DD HH:mm Z',
        output: './logs/combined.log',
        error: './logs/error.log',
        detailsale: './logs/detailsale.log',
        merge_logs: true,
      },
    ],
  };
  