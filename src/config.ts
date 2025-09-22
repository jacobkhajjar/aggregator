import fs from "fs";
import os from "os";
import path from "path";
import { readFileSync } from 'node:fs';
import { config } from "node:process";

export type Config = {
    dbUrl: string,
    currentUserName: string
}

export function setUser(userName: string): void {
    const cfg = readConfig();
    cfg.currentUserName = userName;
    writeConfig(cfg);
}

export function readConfig(): Config {
    const path = getConfigFilePath();
    const rawConfig = fs.readFileSync(path, "utf-8")
    const cfg = JSON.parse(rawConfig);
    return validateConfig(cfg);
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), "/.gatorconfig.json") 
}

function writeConfig(cfg: Config): void {
    const rawConfig = {db_url: cfg.dbUrl, current_user_name: cfg.currentUserName};
    const data = JSON.stringify(rawConfig, null, 2);
    const file = getConfigFilePath();
    fs.writeFileSync(file, data, { encoding: "utf-8" });
    return;
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file");
  }

  const cfg: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };

  return cfg;
}

