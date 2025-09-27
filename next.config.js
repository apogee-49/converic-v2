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
           hostname: 'wkiazsrcdyalslpplhzv.supabase.co',
           pathname: '/storage/v1/object/public/**',
         },
       ],
     },
};

export default config;
