import { Schema, model } from 'mongoose'

const usersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
//   age: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
  password: {
    type: String,
    required: true,
    default: " "
  },
  isAdmid: {
    type: Boolean,
    default: false
  }
})

export const usersModel = model('Users', usersSchema)