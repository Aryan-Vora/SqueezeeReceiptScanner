const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const cachedSecrets = {};

const SECRETNAMES = {
  OCRSPACE_SECRET_KEY_NAME: "ocr_space_key",
  OPENAI_SECRET_KEY_NAME: "openai_api_key",
};

const client = new SecretManagerServiceClient(); // Initialize client once

const projectId = "squeezee-df";

const getSecretFromGCP = async (secretName, version = "latest") => {
  const name = `projects/${projectId}/secrets/${secretName}/versions/${version}`;

  try {
    const [version] = await client.accessSecretVersion({ name });
    const payload = version.payload?.data?.toString();
    return payload ?? null;
  } catch (error) {
    console.error(`Error retrieving secret '${secretName}' from GCP: ${error}`);
    return null;
  }
};

const loadSecret = async (secretName) => {
  if (!cachedSecrets[secretName]) {
    const secretValue = await getSecretFromGCP(secretName);

    if (secretValue) {
      cachedSecrets[secretName] = secretValue;
    }
  }
};

const getOCRSPACEKey = async () => {
  await loadSecret(SECRETNAMES.OCRSPACE_SECRET_KEY_NAME);
  return cachedSecrets[SECRETNAMES.OCRSPACE_SECRET_KEY_NAME] ?? null;
};

const getOPENAIKey = async () => {
  await loadSecret(SECRETNAMES.OPENAI_SECRET_KEY_NAME);
  return cachedSecrets[SECRETNAMES.OPENAI_SECRET_KEY_NAME] ?? null;
};

module.exports = { getOCRSPACEKey, getOPENAIKey };
