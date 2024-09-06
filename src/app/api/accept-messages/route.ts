import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDb from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function Post(request: Request) {
  await connectDb();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userID = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept message",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated",
        updatedUser,
      },
      { status: 2201 }
    );
  } catch (error) {
    console.log("Failed to update user status to accept message");
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept message",
      },
      { status: 500 }
    );
  }
}


export async function GET(request:Request) {
    await connectDb();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
  
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }
  
    const userID = user._id;
    
    try {
    const foundUser= await UserModel.findById(userID)
        if (!foundUser) {
            return Response.json(
              {
                success: false,
                message: "User not found",
              },
              { status: 404 }
            );
          }
    
          return Response.json(
            {
              success: true,
                isAcceptingMassages:foundUser.isAcceptingMessage,
            },
            { status: 200 }
          );
} catch (error) {
    console.log("Failed to update user status to accept message");
    return Response.json(
      {
        success: false,
        message: "Error in getting MessageAcceptance status",
      },
      { status: 500 }
    );
}


} 

