module.exports = {
  apps: [{
    name: 'worker',
    script: '/app/index.js',
    watch: true,
    ignore_watch: ['node_modules'],
  }],
};
