import { promises as fs } from "fs";
import path from "path";
import { FileExportParams } from "../types";
import { exportToOpenScadContent, exportToTSVContent } from "./utils";

const baseOutputDir = path.join(process.cwd(), "raw-output");
const tsvDir = path.join(baseOutputDir, "tsv");
const scadDir = path.join(baseOutputDir, "scad");

export const initializeFolders = async () => {
  await Promise.all([fs.mkdir(tsvDir, { recursive: true }), fs.mkdir(scadDir, { recursive: true })]);
};

export const saveTsvData = async ({ guildName, data }: FileExportParams) => {
  const tsvPath = path.join(tsvDir, `${guildName.toLowerCase()}.tsv`);

  try {
    await fs.access(tsvPath);
    console.log(`Skipped ${tsvPath} (already exists)`);
  } catch {
    const tsvContent = exportToTSVContent(data);
    await fs.writeFile(tsvPath, tsvContent, "utf8");
    console.log(`Exported ${tsvPath}`);
  }
};

export const saveOpenScadData = async ({ guildName, data }: FileExportParams) => {
  const scadPath = path.join(scadDir, `${guildName.toLowerCase()}.scad`);

  try {
    await fs.access(scadPath);
    console.log(`Skipped ${scadPath} (already exists)`);
  } catch {
    const scadContent = exportToOpenScadContent(data, guildName);
    await fs.writeFile(scadPath, scadContent, "utf8");
    console.log(`Exported ${scadPath}`);
  }
};
