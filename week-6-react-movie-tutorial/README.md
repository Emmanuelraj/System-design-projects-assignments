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






