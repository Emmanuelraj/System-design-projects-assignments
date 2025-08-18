/**
 * ### Medium Task: Task Management Filter

- **Real-World Scenario**: You’re developing a task management app (like Trello) that fetches tasks asynchronously and filters completed tasks, simulating an async API response.
- **Description**: Write an async arrow function to filter completed tasks from a simulated async fetch, using promises, variables, loops, and arrow functions.
- **Input**: None (simulated tasks [{ id: 1, completed: false }, { id: 2, completed: true }, { id: 3, completed: true }, { id: 4, completed: false }]).
- **Output**: Array of completed task IDs (e.g., [2, 3]).
- **Time**: ~45 min (Aug 19, 8:30–9:15 PM).
- **Starter Code** (src/medium.ts):
 */


const fetchTasks = (): Promise<{ id: number; completed: boolean }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      { id: 1, completed: false },
      { id: 2, completed: true },
      { id: 3, completed: true },
      { id: 4, completed: false }
    ]), 1000);
  });
};

const filterCompletedTasks = async (): Promise<number[]> => {
  // TODO: Use async/await to fetch tasks
  const fetchTasksDetails = await fetchTasks();
  // TODO: Use a loop to filter completed task IDs
  const completedTaskIds:number[] = [];
  const length = fetchTasksDetails.length;
  for(let i=0;i<length;i++){
         if(fetchTasksDetails[i]["completed"]!==false){
          completedTaskIds.push(fetchTasksDetails[i]["id"]);
         }
  }
  return completedTaskIds;
};

// Test
filterCompletedTasks().then((ids) => console.log(ids)); // Should print [2, 3]