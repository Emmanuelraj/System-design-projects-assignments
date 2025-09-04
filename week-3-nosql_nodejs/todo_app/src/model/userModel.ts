import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Create a Schema constructor from mongoose
// A Schema allows us to define the structure of documents in a collection
const Schema = mongoose.Schema;

// Using ObjectId to create references between documents
// ObjectId is a unique identifier that MongoDB assigns to each document
const ObjectId = Schema.ObjectId; 

dotenv.config();





//create user schema
const users = new Schema({
  name : String,
  email: {type: String, unique: true},
  password: String
})

const todos = new Schema ({
 userId: { type: Schema.Types.ObjectId, ref: "users" },
  title: String,
  done: Boolean
})



const UserModel = mongoose.model('users', users);  // Creating the User model for the 'users' collection
const TodoModel = mongoose.model('todos', todos);  // Creating the Todo model for the 'todos' collection

export  {
  UserModel,
  TodoModel
}