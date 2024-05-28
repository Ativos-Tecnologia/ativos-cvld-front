/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ativos-cvld-prod-32c6589080c0.herokuapp.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1:3000',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'ativoscvld.vercel.app',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'dev-ativoscvld.vercel.app',
                port: '',
                pathname: '/**'
            }
        ],
    }
};

export default nextConfig;
