// Define an arrow function to calculate the total price of items
// Use a loop to sum prices and store in a variable
const calculateTotalPrice = (prices: number[]): number => {
  // TODO: Initialize a variable for total
  let total : number = 0;

  for(const price of prices){
       total+=price;
  }
  // TODO: Use a loop to sum prices
  return total; // Replace with your solution
};

// Test the function
const cart = [10, 20, 30];
console.log(calculateTotalPrice(cart)); // Should print 60