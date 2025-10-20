module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    [
      'babel-plugin-transform-vite-meta-env',
      {
        env: {
          VITE_API_URL: 'http://localhost:3000',
        },
      },
    ],
  ],
};
