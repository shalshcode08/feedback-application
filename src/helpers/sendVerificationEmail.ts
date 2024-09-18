import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/apiResponse';

export async function sendVerificationEmail (email : string, username:string, verifyCode : string) : Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Feedback Verification Code',
            react: VerificationEmail({
                username,
                otp : verifyCode
            }),
          });

        return{
            success:true,
            message:"Verification email sent successfully"
        }
    }catch(error){
        console.log("error sending verification code", error);
        return{
            success:false,
            message:"Failed to send verification email"
        }
    }

}   