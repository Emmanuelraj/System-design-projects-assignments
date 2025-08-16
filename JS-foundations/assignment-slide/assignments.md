Week 1: JavaScript Basics Assignment
Purpose: Practice variables, loops, and arrow functions for Week 1 of  FAANG prep (Aug 16–17, 2025, 8–11 PM, 2–3h/day).Tasks: Complete three tasks (easy, medium, hard) after watching the JS basics video (1.2, Aug 15).Setup: Run npm install, then npm run easy, npm run medium, or npm run hard in mini-js-script/.Solutions: Check solutions/ after attempting tasks.GitHub: Push to your repo with README.md for FAANG recruiters.

Easy Task: Calculate Total Price

Description: Create an arrow function to calculate the total price of items in a cart, using variables and a loop.
Input: Array of prices (e.g., [10, 20, 30]).
Output: Total price (e.g., 60).
Time: ~30 min (Aug 16, 8–8:30 PM).
Starter Code (src/easy.ts):// Define an arrow function to calculate the total price of items
// Use a loop to sum prices and store in a variable
const calculateTotalPrice = (prices: number[]): number => {
  // TODO: Initialize a variable for total
  // TODO: Use a loop to sum prices
  return 0; // Replace with your solution
};

// Test the function
const cart = [10, 20, 30];
console.log(calculateTotalPrice(cart)); // Should print 60


Solution (solutions/easy-solution.ts):const calculateTotalPrice = (prices: number[]): number => {
  let total = 0;
  for (const price of prices) {
    total += price;
  }
  return total;
};

const cart = [10, 20, 30];
console.log(calculateTotalPrice(cart)); // Output: 60




Medium Task: Filter Even Numbers

Description: Write an arrow function to filter even numbers from an array, using a loop and variables.
Input: Array of numbers (e.g., [1, 2, 3, 4, 5, 6]).
Output: Array of even numbers (e.g., [2, 4, 6]).
Time: ~45 min (Aug 16, 8:30–9:15 PM).
Starter Code (src/medium.ts):// Define an arrow function to filter even numbers
// Use a loop and variables to collect even numbers
const filterEvenNumbers = (numbers: number[]): number[] => {
  // TODO: Initialize a variable for even numbers
  // TODO: Use a loop to check and collect even numbers
  return [];
};

// Test the function
const numbers = [1, 2, 3, 4, 5, 6];
console.log(filterEvenNumbers(numbers)); // Should print [2, 4, 6]


Solution (solutions/medium-solution.ts):const filterEvenNumbers = (numbers: number[]): number[] => {
  const evens: number[] = [];
  for (const num of numbers) {
    if (num % 2 === 0) {
      evens.push(num);
    }
  }
  return evens;
};

const numbers = [1, 2, 3, 4, 5, 6];
console.log(filterEvenNumbers(numbers)); // Output: [2, 4, 6]




Hard Task: Group Meetings by Day

Description: Create an arrow function to group meeting times by day, using loops, variables, and your system design idea (UTC timestamps). Simulates a FAANG-style data processing task.
Input: Array of meeting objects with UTC timestamps (e.g., [{ id: "m1", timestamp: "2025-08-16T10:00:00Z" }, { id: "m2", timestamp: "2025-08-16T12:00:00Z" }, { id: "m3", timestamp: "2025-08-17T09:00:00Z" }]).
Output: Object grouping meetings by date (e.g., { "2025-08-16": ["m1", "m2"], "2025-08-17": ["m3"] }).
Time: ~1–1.5h (Aug 17, 8–9:30 PM).
Starter Code (src/hard.ts):interface Meeting {
  id: string;
  timestamp: string; // UTC timestamp, e.g., "2025-08-16T10:00:00Z"
}

// Define an arrow function to group meetings by date
const groupMeetingsByDay = (meetings: Meeting[]): { [date: string]: string[] } => {
  // TODO: Initialize a variable for grouped meetings
  // TODO: Use a loop to extract date from timestamp and group meeting IDs
  return {};
};

// Test the function
const meetings: Meeting[] = [
  { id: "m1", timestamp: "2025-08-16T10:00:00Z" },
  { id: "m2", timestamp: "2025-08-16T12:00:00Z" },
  { id: "m3", timestamp: "2025-08-17T09:00:00Z" }
];
console.log(groupMeetingsByDay(meetings)); // Should print { "2025-08-16": ["m1", "m2"], "2025-08-17": ["m3"] }


Solution (solutions/hard-solution.ts):interface Meeting {
  id: string;
  timestamp: string;
}

const groupMeetingsByDay = (meetings: Meeting[]): { [date: string]: string[] } => {
  const grouped: { [date: string]: string[] } = {};
  for (const meeting of meetings) {
    const date = meeting.timestamp.split("T")[0]; // Extract date (e.g., "2025-08-16")
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(meeting.id);
  }
  return grouped;
};

const meetings: Meeting[] = [
  { id: "m1", timestamp: "2025-08-16T10:00:00Z" },
  { id: "m2", timestamp: "2025-08-16T12:00:00Z" },
  { id: "m3", timestamp: "2025-08-17T09:00:00Z" }
];
console.log(groupMeetingsByDay(meetings)); // Output: { "2025-08-16": ["m1", "m2"], "2025-08-17": ["m3"] }




README.md (in mini-js-script/)
# Mini JS Script Assignment
**Purpose**: Practice JavaScript basics (variables, loops, arrow functions) for Week 1 of  FAANG prep.
**Tasks**:
- **Easy**: Calculate total price of cart items (30 min, Aug 16).
- **Medium**: Filter even numbers from an array (45 min, Aug 16).
- **Hard**: Group meetings by day using UTC timestamps (1–1.5h, Aug 17).
**Setup**: Run `npm install`, then `npm run easy`, `npm run medium`, or `npm run hard`.
**Solutions**: Check `solutions/` for reference after attempting tasks.
**GitHub**: Push to your repo for FAANG recruiters.

