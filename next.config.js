module.exports = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
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
  },
  webpack5: true, // by default, if you customize webpack config, they switch back to version 4.
  // Looks like backward compatibility approach.
  webpack (config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false // the solution
    }

    return config
  }
}
