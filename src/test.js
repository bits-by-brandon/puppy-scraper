const diffDogs = require("./lib/diffDogs");

const setA = [
  {name: "A", location: "X"},
  {name: "B", location: "X"},
  {name: "C", location: "Y"},
  {name: "A", location: "Y"},
]
const setB = [
  {name: "D", location: "X"},
  {name: "C", location: "Y"},
  {name: "A", location: "Y"},
  {name: "B", location: "X"},
]
const {added, removed} = diffDogs(setA, setB)
console.log("added", added);
console.log("removed", removed);
