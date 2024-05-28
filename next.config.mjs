/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['127.0.0.1', 'ativos-cvld-prod-32c6589080c0.herokuapp.com', 'ativoscvld.vercel.app'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ativos-cvld-prod-32c6589080c0.herokuapp.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1:8000',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'ativoscvld.vercel.app',
                port: '',
                pathname: '/**'
            }
        ],
    }
};

export default nextConfig;
