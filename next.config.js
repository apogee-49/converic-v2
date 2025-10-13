/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
     poweredByHeader: false,
     images: {
       remotePatterns: [
        {
          protocol: 'https',
          hostname: 'healthy-goldfinch-760.convex.cloud',
          pathname: '/api/storage/**',
        },
        {
          protocol: 'https',
          hostname: 'content-guineapig-365.convex.cloud',
          pathname: '/api/storage/**',
        },
       ],
     },
};

export default config;
