require("dotenv").config();
const SCPA = require("./scrapers/SPCA");
const SfAnimalCare = require("./scrapers/sfanimalcare");
const FamilyDog = require("./scrapers/familyDog");
const { uploadDog, getUploadedDogs, removeDog } = require("./lib/airtable");
const diffDogs = require("./lib/diffDogs");

async function scrapeDogs() {
  const dogs = [];
  const scrapers = [new SfAnimalCare(), new SCPA()];
  // const scrapers = [new FamilyDog()];
  for (const scraper of scrapers) {
    dogs.push(...(await scraper.scrape()));
  }
  return dogs;
}

async function main() {
  process.setMaxListeners(20);

  console.log("Scraping dog pages...");
  const scrapedDogs = await scrapeDogs();
  console.log(`Done! Found ${scrapedDogs.length} dogs.`);

  console.log("Getting dogs uploaded to Airtable...");
  const uploadedDogs = await getUploadedDogs();
  console.log(`Done! found ${uploadedDogs.length} dogs from Airtable...`);

  const { added, removed } = diffDogs(uploadedDogs, scrapedDogs);
  console.log(`Diff: ${added.length} new dog(s) found in scrape`);
  console.log(`Diff: ${removed.length} dog(s) no longer found in scrape`);

  for (const newDog of added) {
    try {
      await uploadDog(newDog);
      console.log(`Uploaded ${newDog.name}...`);
    } catch (e) {
      console.error(e);
    }
  }
  console.log("Done uploading new dogs to Airtable.");

  for (const removedDog of removed) {
    try {
      await removeDog(removedDog);
      console.log(`Deleted ${removedDog.name}...`);
    } catch (e) {
      console.error(e);
    }
  }
  console.log("Done deleting dogs from Airtable.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
