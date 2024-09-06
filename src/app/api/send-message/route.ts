import connectDb from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await connectDb();

  const { username, content } = await request.json();
  
  try {
    const user = await UserModel.findOne({ username }).exec();
    
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    //////is user accepting the messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    // Push the new message to the user's messages array
   user.messages.push(newMessage as Message);   // / //// / / / // debug this error
    await user.save();
    return Response.json(
        {
          success: true,
          message: "Message Sent successfully",
        },
        { status: 201 }
      );


  } catch (error) {

    console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
  
}
