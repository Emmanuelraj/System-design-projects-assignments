/**
 * 
 * Description: Write an arrow function to filter even numbers from an array, using a loop and variables.
Input: Array of numbers (e.g., [1, 2, 3, 4, 5, 6]).
Output: Array of even numbers (e.g., [2, 4, 6]).
Time: ~45 min .
 * 
 */
const personData = [{
 name:"A",
 gender : "M"

},
{
 name:"B",
 gender : "F"

}];


// arrow function
const calculateEvenNos = (numbers: number[] )=>{
  // callback function
   let femaleCount = 0;
   let maleCount = 0;
  for(let i =0;i<personData.length;i++){
     if(personData[i]["gender"]=="F")
      femaleCount++;
     else
      maleCount++;
  }


  const nos =[11,22,33];
  
  console.log("New Data "+nos.map(no =>no*2));
  
  console.log(personData);
  console.log("How many male  ==>"+maleCount+" female ==>"+femaleCount);
  
  
  const newPersonData = {
    name : "Hello",
    gender :"Male"
  }


  personData.push(newPersonData);

  console.log(personData);


  const newData = personData.filter(personData => personData.name !=="Hello");


  console.log("I have removed personData"+JSON.stringify(newData));
 


  return  numbers.filter(callBackFn);

}

const callBackFn = (value : number)=> value%2==0;

console.log(calculateEvenNos([1, 2, 3, 4, 5, 6]));


