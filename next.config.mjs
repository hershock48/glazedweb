/** @type {import('next').NextConfig} */
// Restricted local runners may disallow child processes. Keep production
// defaults; opt into threads only for local verification in that environment.
const nextConfig = process.env.GLAZED_LOCAL_THREADS === "1"
  ? { experimental: { workerThreads: true, webpackBuildWorker: false, cpus: 1 } }
  : {};

export default nextConfig;
