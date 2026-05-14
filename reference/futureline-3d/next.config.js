/**
 * Next.js config — GLSL shader imports + transpile drei.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Import .frag / .vert / .glsl files as raw strings.
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    })
    return config
  },
  // Three.js subpath imports — keep them on the modern ESM build.
  experimental: {
    optimizePackageImports: ['three', '@react-three/drei'],
  },
}

module.exports = nextConfig
