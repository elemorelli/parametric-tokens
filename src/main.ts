import { getData } from "./data";
import { initializeFolders, saveOpenScadData, saveTsvData } from "./fs";
import { ParsedData } from "./types";
import { cleanText, parseSpecialPlay } from "./utils";

const main = async () => {
  await initializeFolders();

  const rawData = await getData();

  const traitsMap = Object.fromEntries(rawData["Character Traits"].map((trait) => [trait.name, trait.text]));
  const playsMap = Object.fromEntries(rawData["Character Plays"].map((play) => [play.name, play.text]));

  rawData.Guilds.forEach(async ({ name: guildName }) => {
    const models = rawData.Models.filter((model) => model.guild1 === guildName || model.guild2 === guildName);

    const modelsData: ParsedData[] = [];

    models.forEach((model) => {
      model.character_traits?.forEach((traitName) => {
        const text = traitsMap[traitName];
        if (text) {
          modelsData.push({ name: traitName, text: cleanText(text) });
        }
      });

      model.character_plays?.forEach((playName) => {
        const text = playsMap[playName];
        if (text) {
          modelsData.push({ name: playName, text: cleanText(text) });
        }
      });

      const heroic = parseSpecialPlay(model.heroic);
      if (heroic) modelsData.push(heroic);

      const legendary = parseSpecialPlay(model.legendary);
      if (legendary) modelsData.push(legendary);
    });

    const data = Array.from(new Map(modelsData.map((item) => [item.name, item])).values());

    if (data.length > 0) {
      await Promise.allSettled([saveTsvData({ guildName, data }), saveOpenScadData({ guildName, data })]);
    } else {
      console.log(`Skipped ${guildName} (no relevant models found)`);
    }
  });
};

main();
