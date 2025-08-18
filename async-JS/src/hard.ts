/**
 * ### Hard Task: Meeting Scheduler Filter (Simplified)

- **Real-World Scenario**: You’re building a meeting scheduler (like Calendly) that reads meeting data from a JSON file and filters meetings for a specific date, using your UTC timestamp idea for consistency across time zones (like your system design insight).
- **Description**: Create an async arrow function to read meetings from data.json, filter meetings for "2025-08-16", and return their titles, using async/await, promises, variables, loops, arrow functions, and file reading.
- **Input**: data.json (see setup).
- **Output**: Array of meeting titles for "2025-08-16" (e.g., ["Team Sync", "Planning Session"]).
 * 
 */


 import fs from 'fs';


const readMeeting = async  ()=> {
  return new Promise((resolve, reject)=>{
    
 fs.readFile('data.json', 'utf-8', (err, data) => {
 if (err) {
        reject(err);
        return;
      }

   const targetDate = "2025-08-16";
   const groupedMeetingsByDate: any = {}
   const fileData = JSON.parse(data);
   const n = fileData.length;
   const dataArr:number[] = [];

   const filterMeetings =  fileData.filter((meeting: { timestamp: string; }) => meeting.timestamp.split("T")[0] === targetDate)
   .map((meeting: any )=>meeting.title);
  
   //console.log(filterMeetings);
   // traditional way 
   for(let i =0;i<n;i++){
      const contentDate = fileData[i]["timestamp"].split("T")[0];
      const meetingTitle  = fileData[i]["title"]
      if(contentDate === targetDate){
          dataArr.push(meetingTitle);
      }
   }
  
   resolve (filterMeetings);
});

  });
}


readMeeting().then((datas)=>{
  console.log(datas);
});

