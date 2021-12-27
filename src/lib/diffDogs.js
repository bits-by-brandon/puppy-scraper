const makeDogId = require("./makeDogId");

module.exports = function diffDogs(setA, setB) {
  const removed = setA.filter((dogA) => {
    return setB.findIndex((dogB) => makeDogId(dogA) === makeDogId(dogB)) === -1;
  });
  const added = setB.filter((dogB) => {
    return setA.findIndex((dogA) => makeDogId(dogB) === makeDogId(dogA)) === -1;
  });
  return { added, removed };
};
