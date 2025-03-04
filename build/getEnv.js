const path = require("path");

const isDevFn = (mode) => {
  return mode === "development";
};

const isProdFn = (mode) => {
  return mode === "production";
};

const isTestFn = (mode) => {
  return mode === "test";
};

/**
 * Whether to generate package preview
 */
const isReportMode = () => {
  return process.env.VITE_REPORT === "true";
};

// Read all environment variable configuration files to process.env
const wrapperEnv = (envConf) => {
  const ret = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;
    if (envName === "VITE_PORT") realName = Number(realName);
    ret[envName] = realName;
  }
  return ret;
};

/**
 * Get user root directory
 * @param dir file path
 */
const getRootPath = (...dir) => {
  return path.resolve(process.cwd(), ...dir);
};

export { isDevFn, isProdFn, isTestFn, isReportMode, wrapperEnv, getRootPath };