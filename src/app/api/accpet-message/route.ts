import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth';

export async function POST (request : Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "Not authenticated"
        },{status : 401})
    }

    const userID = user._id;
    const {acceptMessage} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userID,
            {isAcceptingMessage : acceptMessage},
            {new: true}
        )
        if(!updatedUser){
            return Response.json({
                success : false,
                message : "Failed to update user status to accpet messages"
            },{status : 401})
        }

        return Response.json({
            success : true,
            message : "Mesasge acceptence status upadted successfully",
            updatedUser
        },{status : 200})
    } 
    catch (error) {
        console.error("Failed to update user status to accpet messages")
        return Response.json({
            success : false,
            message : "Failed to update user status to accpet messages"
        },{status : 500})
    }
}



export async function GET (request : Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "Not authenticated"
        },{status : 401})
    }

    const userID = user._id;

    try {
        const foundUser = await UserModel.findById(userID)
        if(!foundUser){
            return Response.json({
                success : false,
                message : "User not found"
            },{status : 404})
        }
    
        return Response.json({
            success : true,
            isAcceptingMessage : foundUser.isAcceptingMessage
        },{status : 200})
    } 
    catch (error) {
        console.error("Error in getting message acceptance message")
        return Response.json({
            success : false,
            message : "Error in getting message acceptance message"
        },{status : 500})
    }
}