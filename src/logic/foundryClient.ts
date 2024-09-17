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

// TODO: fix this so we can have a better way to store refresh token
// https://github.com/palantir/osdk-ts/blob/3c05ea607bada4eec2b8f7480c3183cbd7fec444/packages/oauth/src/common.ts
export const createFoundryClient = (): Client => {
  checkEnv(process.env.FOUNDRY_CLIENT_ID, "FOUNDRY_CLIENT_ID");
  checkEnv(process.env.FOUNDRY_CLIENT_SECRET, "FOUNDRY_CLIENT_SECRET");
  checkEnv(process.env.FOUNDRY_URL, "FOUNDRY_URL");
  checkEnv(process.env.FOUNDRY_ONTOLOGY_RID, "FOUNDRY_ONTOLOGY_RID");

  const auth = createConfidentialOauthClient(
    process.env.FOUNDRY_CLIENT_ID,
    process.env.FOUNDRY_CLIENT_SECRET,
    process.env.FOUNDRY_URL,
    undefined,
    // TODO: maybe push this upstream into OSDK, we need to do this so auth doesn't break
    (url, options) => fetch(url, { ...options, cache: "no-store" })
  );

  return createClient(
    process.env.FOUNDRY_URL,
    process.env.FOUNDRY_ONTOLOGY_RID,
    auth
  );
};

export const foundryClient = createFoundryClient();
