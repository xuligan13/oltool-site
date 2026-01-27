const securityHeaders = [
  // Prevents cross-site scripting (XSS) attacks
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  // Prevents MIME-sniffing attacks
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // Controls how much referrer information is sent
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  // Prevents clickjacking attacks
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}

export default nextConfig
