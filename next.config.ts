import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "dr-mgr-educational-and-rese-oa",
  project: "javascript-nextjs",

  // Only print logs when uploading source maps in build
  silent: true,

  // For all available options, see:
  // https://docs.sentry.io/prerequisites/universal-select-path/
  widenClientFileUpload: true,
});
