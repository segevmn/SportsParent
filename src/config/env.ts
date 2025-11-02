import 'dotenv/config';

export function getEnv(key: string, defaultValue?: string): string {
  const val = process.env[key];
  if (val !== undefined) return val;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(
    `Environment variable ${key} is not set and no default value provided.`,
  );
}
