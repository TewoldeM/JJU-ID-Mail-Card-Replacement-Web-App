import { NextResponse, NextRequest } from 'next/server';


export async function POST(request: Request) {
  try {
    
  
    const { userId, IsBlocked } = await request.json();
    if (!userId || typeof IsBlocked !== "boolean") {
      return NextResponse.json({message:"userId or IsBlocked is Required"}, { status: 400 });
    }
    const user = await prisma?.user.findUnique({ where: { Id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.IsLocked === IsBlocked) {
      return NextResponse.json({ message: "User is already in the desired state" }, { status: 400 });
    }
    if (user.deletedAt) {
      return NextResponse.json({ message: "User is deleted Can't be Blocked" }, { status: 400 });
    }

    await prisma?.user.update({
      where: { Id: userId, },
      data: { IsBlocked: IsBlocked, }
    })
    await prisma?.notification.create({
      data: {
        StudentId: user.StudentId,
        message: IsBlocked ? "Your account has been blocked" : "Your account has been unblocked",
        read: false,
      }
    })
    return NextResponse.json({ message: IsBlocked ? "User blocked successfully" : "User unblocked successfully" });
  } catch (error:any) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
