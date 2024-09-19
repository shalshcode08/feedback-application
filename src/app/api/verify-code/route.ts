import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'

export async function POST(request : Request) {
    await dbConnect()

    try {
        const {username, code} = await request.json()
        const decodedUsername =  decodeURIComponent(username)

        const user = await UserModel.findOne({username : decodedUsername})

        if(!user){
            return Response.json({
                message : "user not found",
                success:false
            },
            {status:500}
        )}

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json({
                message : "account verified successfully",
                success:true
            },
            {status:200}
        )}
        else if(!isCodeNotExpired){
            return Response.json({
                message : "verification code has expired please signup again to get new code",
                success:false
            },
            {status:400}
            )
        }
        else{
            return Response.json({
                message : "incorrect verification code",
                success:false
            },
            {status:400}
            )
        }
        

    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json({
            message : "error verifying user",
            success:false
        },
        {
            status:500
        }
    )}
}