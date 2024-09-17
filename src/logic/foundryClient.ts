import { Client, createClient } from "@osdk/client";
import { createConfidentialOauthClient } from "@osdk/oauth";

function checkEnv(
  value: string | undefined,
  name: string
): asserts value is string {
  if (value == null) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

function createFoundryClient(): Client {
  checkEnv(process.env.FOUNDRY_CLIENT_ID, "FOUNDRY_CLIENT_ID");
  checkEnv(process.env.FOUNDRY_CLIENT_SECRET, "FOUNDRY_CLIENT_SECRET");
  checkEnv(process.env.FOUNDRY_URL, "FOUNDRY_URL");
  checkEnv(process.env.FOUNDRY_ONTOLOGY_RID, "FOUNDRY_ONTOLOGY_RID");

  const auth = createConfidentialOauthClient(
    process.env.FOUNDRY_CLIENT_ID,
    process.env.FOUNDRY_CLIENT_SECRET,
    process.env.FOUNDRY_URL
  );

  return createClient(
    process.env.FOUNDRY_URL,
    process.env.FOUNDRY_ONTOLOGY_RID,
    auth
  );
}

// Implementing this so refresh token gets stored
// https://github.com/palantir/osdk-ts/blob/3c05ea607bada4eec2b8f7480c3183cbd7fec444/packages/oauth/src/common.ts
const storage = new Map<string, string>();
globalThis.localStorage = {
  setItem: (key, value) => storage.set(key, value),
  getItem: (key) => storage.get(key) ?? null,
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
  key: (index) => Array.from(storage.keys())[index],
  length: 0,
};
export const foundryClient = createFoundryClient();
