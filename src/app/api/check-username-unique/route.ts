import {z} from 'zod'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { usernameValidation } from '@/schemas/signUpSchema'

const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET (request : Request){
    await dbConnect();

    try {
        const{searchParams} = new URL(request.url)
        const queryParams = { 
            username : searchParams.get('username')
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                message : usernameErrors?.length > 0 ? usernameErrors.join(', ') : "invalid query parameters",
                success:false
            }, {status:400})
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username , isVerified:true})
        if(existingVerifiedUser){
            return Response.json({
                message:"Username is already taken",
                success : false
            },{status:400})
        }

        return Response.json({
            message:"Username is unique",
            success : true
        },{status:200})

    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            message : "error checking username",
            success:false
        },
        {
            status:500
        }
    )
    }
}