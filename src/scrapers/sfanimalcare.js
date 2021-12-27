const getPage = require("../lib/getPage")

class SfAnimalCare {
  constructor() {
    this.indexPage = "https://petharbor.com/results.asp?searchtype=ADOPT&start=1&nopod=1&grid=1&friends=0&samaritans=1&nosuccess=0&rows=10&imght=120&imgres=detail&tWidth=300&view=sysadm.v_snfr_weight&nobreedreq=1&nomax=1&nocustom=1&fontface=arial&fontsize=10&miles=20&shelterlist=%27SNFR%27&atype=&where=type_DOG&NewOrderBy=Weight&PAGE=1"
  }

  async scrape() {
    const page = await getPage(this.indexPage);
    console.log(`Got index page for SF Animal Care and Control, waiting for content to load...`)

    const dogCards = await page.$$(".gridResult");

    const dogs = [];
    for (const card of dogCards) {
      const name = await card.$eval(".gridText:nth-of-type(2)", node => node.textContent)
      const gender = await card.$eval(".gridText:nth-of-type(3)", node => node.textContent)
      const age = await card.$eval(".gridText:nth-of-type(6)", node => node.textContent)
      const breed = await card.$eval(".gridText:nth-of-type(5)", node => node.textContent)
      const link = await card.$eval("a", node => node.href)
      const image = await card.$eval("img", node => node.src)
      // const age = await table.$eval("tr:nth-of-type(1) td", node => node.textContent)
      // const gender = await table.$eval("tr:nth-of-type(3) td", node => node.textContent)
      // const breed = await table.$eval("tr:nth-of-type(4) td", node => node.textContent)

      const dog = {
        name: name.replace(/\(.+\)/, '').trim().toLowerCase(),
        age: age.trim(),
        gender: /female/i.test(gender.trim()) ? "Female" : "Male",
        breed: breed.trim().split(","),
        url: link,
        location: "SF Animal Care and Control",
        image
      }
      dogs.push(dog);
    }

    return dogs;
  }
}

module.exports = SfAnimalCare
