/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Krok 1: Definiujemy, które obrazy mają być optymalizowane.
    // Tutaj wpisujemy tylko Cloudinary.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/**`,
      },
    ],
    // Krok 2 (bardzo ważny): Mówimy Next.js, aby nie próbował
    // optymalizować żadnych innych obrazów spoza listy remotePatterns.
    // To zapobiegnie błędom dla domen takich jak 'si.geilicdn.com'.
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
}

export default nextConfig