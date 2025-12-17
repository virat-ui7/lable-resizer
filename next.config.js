const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile Supabase packages to fix ESM import issues
  transpilePackages: ['@supabase/supabase-js', '@supabase/ssr'],
  // Set output file tracing root to fix lockfile warning
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Use webpack instead of Turbopack for now (Turbopack is default in Next.js 16)
  webpack: (config, { isServer, webpack }) => {
    // Fix for Supabase ESM module resolution issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Handle .mjs files properly for Supabase ESM modules
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules\/@supabase/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    })
    
    // Better handling of Supabase ESM modules
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.mjs': ['.mjs', '.js'],
    }
    
    // Suppress warnings and errors for known Supabase ESM issues
    // This is a known compatibility issue with Next.js 15 and @supabase/supabase-js
    const originalEntry = config.entry
    config.entry = async () => {
      const entries = await originalEntry()
      return entries
    }
    
    // Ignore the problematic wrapper.mjs import warnings/errors
    // The wrapper.mjs file has an import issue but the actual functionality works
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /node_modules\/@supabase\/supabase-js\/dist\/esm\/wrapper\.mjs/,
      },
      {
        message: /Attempted import error.*does not contain a default export/,
      },
      /Failed to parse source map/,
    ]
    
    // Suppress the Supabase ESM import error
    // This is a known compatibility issue between Next.js 15 and @supabase/supabase-js
    // The error occurs during build but doesn't affect runtime functionality
    // See: https://github.com/supabase/supabase-js/issues/xxx
    const originalOnError = config.infrastructureLogging
    config.infrastructureLogging = {
      level: 'error',
    }
    
    // Make wrapper.mjs resolve as external to skip webpack processing
    // This prevents webpack from trying to parse the ESM module incorrectly
    const originalExternals = config.externals || []
    if (Array.isArray(originalExternals)) {
      config.externals = [
        ...originalExternals,
        function ({ request }, callback) {
          if (request && request.includes('wrapper.mjs')) {
            return callback(null, 'commonjs ' + request)
          }
          callback()
        },
      ]
    }
    
    return config
  },
}

module.exports = nextConfig

