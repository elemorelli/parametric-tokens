import { ParsedData } from "../types";

export const cleanText = (text: string) => {
  return text
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\.\s*$/, "")
    .trim();
};

export const parseSpecialPlay = (raw: string | undefined) => {
  if (!raw) return null;
  const [nameLine, ...textParts] = raw.split("\n");
  let name = nameLine.trim();
  let extraText = "";

  const match = name.match(/\[(.*?)\]/);
  if (match) {
    extraText = `${match[1]}. `;
    name = name.replace(match[0], "").trim();
  }

  const text = extraText + textParts.join(" ").replace(/\n/g, " ").trim();

  return { name, text };
};

export const exportToTSVContent = (data: ParsedData[]): string => {
  return data.map(({ name, text }) => `${name}\t${text}`).join("\n");
};

export const exportToOpenScadContent = (data: ParsedData[], guildName: string): string => {
  const guildId = guildName.toLowerCase();

  const header = `
logo_left = [
  [ "path", "svgs/icon-${guildId}-left.svg" ],
  [ "rotation", -30 ],
  [ "mirrored", true ],
  [ "scaled", 0.9 ]
];

logo_right = [
  [ "path", "svgs/icon-${guildId}-right.svg" ],
  [ "rotation", -30 ],
  [ "mirrored", false ],
  [ "scaled", 1.2 ]
];
`.trim();

  const tokenEntries = data.map(({ name, text }) => {
    const fullText = `${name}: ${text}`;
    const lines = fullText
      .split(".")
      .map((line) => line.trim().replace(/"/g, '\\"'))
      .filter((line) => line.length > 0);

    const font_sizes = lines.map((_, i) => Math.max(6 - i, 3));
    const apertures = lines.map((_, i) => 100 - i * 10);

    const formattedLines = lines.map((l) => `"${l}"`).join(", ");
    const formattedSizes = font_sizes.join(", ");
    const formattedApertures = apertures.join(", ");

    return `  [
    [ "lines", [ ${formattedLines} ] ],
    [ "font_sizes", [ ${formattedSizes} ] ],
    [ "apertures", [ ${formattedApertures} ] ]
  ]`;
  });

  const tokens = `tokens = [\n${tokenEntries.join(",\n")}\n];`;

  return `${header}\n\n${tokens}\n`;
};
