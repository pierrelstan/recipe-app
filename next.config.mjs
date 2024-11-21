/** @type {import('next').NextConfig} */
const nextConfig = {
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'pinchofyum.com',
            pathname: '**',
          },
        ],
      },
    };

export default nextConfig;
