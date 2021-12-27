const fetch = require("node-fetch");

class FamilyDog {
  constructor() {
    this.origin = " https://ilovefamilydog.org";
    this.endpoint = "/wp-admin/admin-ajax.php";
  }

  async scrape() {
    const response = await fetch(this.origin + this.endpoint, {
      insecureHTTPParser: true,
      method: "post",
      headers: {
        "Origin": this.origin,
        "Referrer": this.origin + "/adopt/",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "application/json"
      },
    });

    console.log("Got dogs from sfspca API...");
    const results = await response.json();
    console.log(results);
    process.exit(0);

    return results.map((result) => ({
      name: result.title,
      gender: /female/i.test(result.tags.gender) ? "Female" : "Male",
      breed: result.tags.breed.split(","),
      age: result.age,
      location: result.tags.site,
      url: result.permalink,
      image: result.thumb[0],
    }));

    // const page = await getPage(this.indexPage);
    // console.log(`Got index page for SPCA, waiting for content to load...`);
    // let found = false;
    // while (!found) {
    //   const result = await page.$$(".userContent__item");
    //   if (result.length > 1) {
    //     found = result;
    //   }
    // }
    //
    // const dogLinks = [];
    // for (let linkPromise of found) {
    //   const link = await linkPromise.$eval(
    //     ".userContent__permalink",
    //     (node) => node.href
    //   );
    //   dogLinks.push(link);
    // }
    //
    // const dogs = [];
    // for (const link of dogLinks) {
    //   console.log(`Scraping dog page ${link}...`);
    //   let dogPage;
    //   try {
    //     dogPage = await getPage(link, { timeout: 60000 });
    //   } catch (e) {
    //     console.error(e);
    //   }
    //
    //   const name = await dogPage.$eval(
    //     ".elementor-heading-title",
    //     (node) => node.textContent
    //   );
    //   const image = await dogPage.$eval(
    //     ".adoptionCarousel--item img",
    //     (node) => node.src
    //   );
    //
    //   const table = await dogPage.$(".adoptionFacts__table");
    //   const age = await table.$eval(
    //     "tr:nth-of-type(1) td",
    //     (node) => node.textContent
    //   );
    //   const gender = await table.$eval(
    //     "tr:nth-of-type(3) td",
    //     (node) => node.textContent
    //   );
    //   const breed = await table.$eval(
    //     "tr:nth-of-type(4) td",
    //     (node) => node.textContent
    //   );
    //
    //   const dog = {
    //     name: name.trim(),
    //     age: age.trim(),
    //     gender: /female/i.test(gender.trim()) ? "Female" : "Male",
    //     breed: breed.trim().split(","),
    //     url: link,
    //     location: "SPCA",
    //     image,
    //   };
    //
    //   dogs.push(dog);
    // }

    // return dogs;
  }
}

module.exports = FamilyDog;
