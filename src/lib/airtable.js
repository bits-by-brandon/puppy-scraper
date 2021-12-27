const Airtable = require("airtable");
const base = new Airtable().base("app8aTRIeHY6WhEVM");

function checkIfDogExists(dog) {
  return new Promise((resolve, reject) => {
    base("Dogs")
      .select({
        maxRecords: 2,
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.

          records.forEach(function (record) {
            if (
              record.fields.Name === dog.name &&
              record.fields.Location === dog.location
            )
              resolve(true);
          });

          fetchNextPage();
        },
        (err) => {
          if (err) reject(err);
          resolve(false);
        }
      );
  });
}

function upload(dog) {
  return new Promise((resolve, reject) => {
    base("Dogs").create(
      [
        {
          fields: {
            Name: dog.name,
            Age: dog.age,
            Gender: dog.gender,
            Link: dog.url,
            Location: dog.location,
            Breed: dog.breed,
            Image: [
              {
                url: dog.image,
              },
            ],
          },
        },
      ],
      { typecast: true },
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

async function removeDog(dog) {
  if (!dog.id) {
    throw new Error(
      `Attempting to remove dog ${dog.name}, but entry has no id`
    );
  }

  return new Promise((resolve, reject) => {
    base("Dogs").destroy([dog.id], (err) => {
      if (err) reject(err);
      resolve(dog.id);
    });
  });
}

async function uploadDog(dog) {
  const dogExists = await checkIfDogExists(dog);
  if (dogExists) return;
  await upload(dog);
}

async function getUploadedDogs() {
  return new Promise((resolve, reject) => {
    const dogs = [];
    base("Dogs")
      .select({ view: "Grid view" })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
          records.forEach(function (record) {
            console.log('Retrieved', record.get('Name'));
            dogs.push({
              id: record.id,
              name: record.fields.Name,
              breed: record.fields.Breed,
              image: record.fields.Image.url,
              gender: record.fields.Gender,
              age: record.fields.Age,
              link: record.fields.Link,
              location: record.fields.Location,
            });
          });

          fetchNextPage();
        },
        (err) => {
          if (err) reject(err);
          resolve(dogs);
        }
      );
  });
}

module.exports = {
  removeDog,
  uploadDog,
  getUploadedDogs,
};
