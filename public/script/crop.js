// Define arrays for each season with crop names
const springCrops = ["Wheat", "Barley", "Mustard", "Gram", "Lentils"];
const summerCrops = ["Rice", "Cotton", "Sugarcane", "Maize", "Soybean"];
const monsoonCrops = ["Rice", "Maize", "Millets", "Turmeric", "Groundnut"];
const autumnCrops = ["Rice", "Wheat", "Barley", "Mustard", "Lentils"];

// Function to get a random crop based on the current season
function getRandomCrop() {
  // Get the current month (assuming it's represented as a number, e.g., January is 0)
  const currentMonth = new Date().getMonth();

  // Determine the season based on the month
  let season;
  if (currentMonth >= 2 && currentMonth <= 4) {
    season = springCrops;
  } else if (currentMonth >= 5 && currentMonth <= 7) {
    season = summerCrops;
  } else if (currentMonth >= 8 && currentMonth <= 10) {
    season = monsoonCrops;
  } else {
    season = autumnCrops;
  }

  // Get a random index from the selected season array
  const randomIndex = Math.floor(Math.random() * season.length);

  // Return the random crop name
  return season[randomIndex];
}

// Example usage
const randomCrop = getRandomCrop();
const result = `The randomly selected crop of the season is ${randomCrop}.`;
console.log(result);


