import { Data } from "./types";

const DATA_URL = "https://raw.githubusercontent.com/cleech/GBPlaybook/refs/heads/pwa/public/data/GB-Playbook-4-7.json";

export async function getData(): Promise<Data> {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  return response.json();
}
