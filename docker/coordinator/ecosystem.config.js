module.exports = {
  apps: [{
    name: 'coordinator',
    script: '/app/server/index.js',
    watch: true,
    ignore_watch: ['node_modules'],
  }],
};
