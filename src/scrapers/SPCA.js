const getPage = require("../lib/getPage");
const fetch = require("node-fetch");

class SPCA {
  constructor() {
    this.query =
      "https://www.sfspca.org/wp-json/sfspca/v1/filtered-posts/get-adoptions?current-term%5Bid%5D=94&current-term%5Btaxonomy%5D=species&ignored-terms%5Bsfspca-adoption-site%5D%5B%5D=74&ignored-terms%5Bsfspca-adoption-site%5D%5B%5D=128&ignored-terms%5Bsfspca-adoption-site%5D%5B%5D=485&ignored-terms%5Bsfspca-adoption-gender%5D%5B%5D=354&order=ASC&orderby=date&page=1&per_page=100";
  }

  async scrape() {
    const response = await fetch(this.query);
    console.log("Got dogs from sfspca API...");
    const results = await response.json().then((res) => res.items);
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

module.exports = SPCA;
