/**Hard Task: Group Meetings by Day

Description: Create an arrow function to group meeting times by day, using loops, variables, and your system design idea (UTC timestamps). Simulates a FAANG-style data processing task.
Input: Array of meeting objects with UTC timestamps (e.g., [{ id: "m1", timestamp: "2025-08-16T10:00:00Z" }, { id: "m2", timestamp: "2025-08-16T12:00:00Z" }, { id: "m3", timestamp: "2025-08-17T09:00:00Z" }]).
Output: Object grouping meetings by date (e.g., { "2025-08-16": ["m1", "m2"], "2025-08-17": ["m3"] }).
Time: ~1–1.5h (Aug 17, 8–9:30 PM).
Starter Code (src/hard.ts):
*/

import { log } from "console";


interface Meeting {
  id: string;
  timestamp: string; // UTC timestamp, e.g., "2025-08-16T10:00:00Z"
}

// Define an arrow function to group meetings by date
const groupMeetingsByDay = (meetings: Meeting[]): { [date: string]: string[] } => {

  const groupedMeetingsByDate: any = {}
  // TODO: Initialize a variable for grouped meetings
  // TODO: Use a loop to extract date from timestamp and group meeting IDs
  const  nos:number = meetings.length;
  const outputJson = {};
  const myMap =  new Map<string, string[]>();

  for(let i = 0;i< nos;i++){
          const firstIdxVal = meetings[i]["timestamp"].split("T");
          const dates:string = firstIdxVal[0]; // Extract the TimeStamp
          const id:string = meetings[i]["id"];
          
          if(myMap.has(dates)){             
            myMap.get(dates)!.push(id); // push into existing array   
          }else{
          
            myMap.set(dates, [id]);
          
          }
  }
 
 //iterate map and put 
  //console.log(groupedMeetingsByDate);
  return groupedMeetingsByDateFn(myMap);
};

// arrow function
const groupedMeetingsByDateFn =(myMap: Map<string, string[]>)=>{

    const groupedMeetingsByDate: any = {}
   for(let [date, ids] of myMap.entries()){
      groupedMeetingsByDate[date] = ids;
      }
  return groupedMeetingsByDate;
}


// Test the function
const meetings: Meeting[] = [
  { id: "m1", timestamp: "2025-08-16T10:00:00Z" },
  { id: "m2", timestamp: "2025-08-16T12:00:00Z" },
  { id: "m3", timestamp: "2025-08-17T09:00:00Z" }
];
console.log(groupMeetingsByDay(meetings)); // Should print { "2025-08-16": ["m1", "m2"], "2025-08-17": ["m3"] }
