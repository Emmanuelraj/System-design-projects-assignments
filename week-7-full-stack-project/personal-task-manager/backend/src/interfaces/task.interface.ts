export interface Task{
    title : String;
    description: String;
    user: User;

}


export interface User{
    username: String;
    password: String;
    userId : String;
}