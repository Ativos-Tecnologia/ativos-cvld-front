/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ativos-cvld-prod-32c6589080c0.herokuapp.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1:8000',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'ativoscvld.vercel.app',
                port: '',
                pathname: '/**',
            },
        ],
    },
    transpilePackages: ['geist'],
};

export default nextConfig;
