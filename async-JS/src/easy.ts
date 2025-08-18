/**
### Easy Task: E-Commerce Cart Total

- **Real-World Scenario**: You’re building an e-commerce API (like Paytm) that fetches cart items asynchronously and calculates the total price, simulating an async database query.
- **Description**: Create an async arrow function using a Promise to fetch item prices and calculate their total, using variables, loops, and arrow functions.
- **Input**: None (simulated prices [10, 20, 30] from a mock API call).
- **Output**: Total price (e.g., 60).
- **Time**: ~30 min (Aug 19, 8–8:30 PM).
- **Starter Code** (src/easy.ts):
*/
    
    
    const fetchCartItems = (): Promise<number[]> => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([10, 20, 30]), 1000); // Simulates async API call
      });
    };
    
    const getCartTotal = async (): Promise<number> => {
      // TODO: Use async/await to fetch prices
      const prices = await fetchCartItems();
      // TODO: Use a loop to sum prices with a variable
      let total = 0;
      for(const price of prices){
       total = total+price;
      }
      return total;
    };
    
    // Test
    getCartTotal().then((total) => console.log(total)); // Should print 60
  