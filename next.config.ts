import type {NextConfig} from "next";

const nextConfig: NextConfig = {};
module.exports = {
	images: {
		domains: ['s3.amazonaws.com', 'acdn-us.mitiendanube.com'],
	}
}

export default nextConfig;
