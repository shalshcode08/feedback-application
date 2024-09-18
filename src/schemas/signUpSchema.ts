import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 character")
    .max(10, "Username must be of 10 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")


export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message:"Invalid Email address"}),
    password : z.string().min(6, {
        message : "Password must be atleast 6 Characters"
    }),
}) 