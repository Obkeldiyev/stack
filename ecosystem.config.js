module.exports = {
  apps: [{
    name: 'kidsbank-api',
    script: 'java',
    args: [
      '-jar',
      '-Dspring.profiles.active=production',
      '-Dserver.port=8080',
      '-Djava.security.egd=file:/dev/./urandom',
      './stack/target/kidsbank-api-1.0.0.jar'
    ],
    cwd: './',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    env: {
      NODE_ENV: 'production',
      JAVA_OPTS: '-Xmx1024m -Xms512m -XX:+UseG1GC -XX:+UseStringDeduplication',
      SPRING_PROFILES_ACTIVE: 'production'
    },
    env_production: {
      NODE_ENV: 'production',
      JAVA_OPTS: '-Xmx1536m -Xms768m -XX:+UseG1GC -XX:+UseStringDeduplication -XX:MaxGCPauseMillis=200',
      SPRING_PROFILES_ACTIVE: 'production'
    },
    log_file: './logs/kidsbank-api.log',
    out_file: './logs/kidsbank-api-out.log',
    error_file: './logs/kidsbank-api-error.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Ubuntu-specific optimizations
    kill_timeout: 5000,
    listen_timeout: 8000,
    // Health monitoring
    health_check_grace_period: 30000
  }]
};