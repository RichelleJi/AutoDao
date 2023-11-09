/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/RichelleJi',
        permanent: false,
      },

    ];
  },
};
