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

export const foundryClient = createFoundryClient();
