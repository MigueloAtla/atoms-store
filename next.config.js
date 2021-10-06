module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'avatars.githubusercontent.com']
  },
  async rewrites () {
    return [
      {
        source: '/admin/:any*',
        destination: '/admin'
      }
    ]
  }
}
