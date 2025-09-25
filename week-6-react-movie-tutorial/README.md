# create a react project

- To initaiate react project


the npm create vite@latest 


vite is lightweight 


npm install 


public folder contains static images


npm run dev -> run on development server



what is components ?


 it is a function which returns JSX


example 

function App(){


    return(
        <div>
        </div>
    )
}

components always start with Capital letter


function App(){

}


it should have one parent element to return 


example 

valid 
function App(){


    return(
        <div>
        </div>
    )
}


Invalid 


function App(){


    return(
        <div>
        </div>
        <!--2nd-->
        <div>
        </div>
    )
}



even if you want use mulitple div to send use fragment 

<>
</>


if you want to send props





class in reservered keyword in JS use className to avoid conflict


conditional rendering

before return components we will call the conditional rendering



Basically




# 🚀 The Movie Vault App

This project was built as a rapid refresh to cover all the essential foundational concepts of React, allowing for a quick transition to core System Design topics.

---

## 🎯 Goal

The primary goal was to build a simple, interactive application that manages a list of items and demonstrates **state management** without relying on complex external libraries.

---

## ✨ Core React Concepts Covered

This project successfully implemented the following core concepts:

1.  **Functional Components:** Creating reusable UI components (`App` and `MovieCard`).
2.  **`useState` Hook:** Managing local component data (e.g., `movies`, `searchTerm`, `isLoading`).
3.  **Props:** Passing data and handler functions down from parent (`App`) to child (`MovieCard`).
4.  **Event Handling:** Attaching `onClick` handlers to buttons and using **named functions** for clarity.
5.  **State Immutability (CRITICAL CONCEPT):** Updating arrays and objects (Liking/Favoriting) by using the `.map()` function and the spread operator (`...`) to create **new copies** rather than modifying the original state directly.
6.  **Derived State & Filtering:** Creating a new array (`displayedMovies`) based on existing state (`movies`, `searchTerm`, `showFavorites`) immediately before rendering.
7.  **`useEffect` Hook:** Handling **side effects** like simulating asynchronous data fetching on component mount (`[]`).
8.  **Conditional Rendering:** Using a **Ternary Operator** (`isLoading ? <Loader /> : <App />`) to show a loading state while data is being fetched.

---

## 🛠️ Key Takeaways

| Concept | Implementation Summary |
| :--- | :--- |
| **Immutability** | `setMovies(movies.map(...))` - **Never** push, pop, or directly modify the state variable. |
| **Data Flow** | Handlers are defined in the parent (`App`) and passed down as **props** to the children (`MovieCard`). |
| **Filtering** | Filtering is performed **on every render** using standard JavaScript (`.filter()`) to create the list that is actually displayed (`displayedMovies`). |

---

## ⚙️ Running the Project

To run this project for review:

1.  Navigate into the project directory: `cd movie-vault`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`






