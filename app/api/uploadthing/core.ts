// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
// import { PrismaClient } from "@prisma/client";
// import { NextRequest } from "next/server";
// import { jwtVerify, JWTPayload } from "jose";

// const prisma = new PrismaClient();
// const f = createUploadthing();
// const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

// const authenticateUser = async (req: NextRequest) => {
//   const token = req.cookies.get("token")?.value;
//   console.log("Token from cookie:", token); // Debug log
//   if (!token) {
//     console.error("No token found in cookie");
//     throw new UploadThingError("Unauthorized: No token found");
//   }

//   try {
//     const secret = new TextEncoder().encode(JWT_SECRET);
//     const { payload } = await jwtVerify(token, secret, { clockTolerance: 15 });
//     console.log("JWT payload:", payload); // Debug log

//     const userId = (payload as JWTPayload & { Id?: string })?.Id;
//     const roles = (payload as JWTPayload & { Roles?: string[] })?.Roles || [];

//     if (!userId) {
//       console.error("Invalid token: Missing user ID");
//       throw new UploadThingError("Invalid token: Missing user ID");
//     }

//     const user = await prisma.user.findUnique({
//       where: { Id: userId },
//       include: { Roles: true },
//     });

//     if (!user) {
//       console.error(`User not found for ID: ${userId}`);
//       throw new UploadThingError("User not found");
//     }

//     // Map roles to lowercase for consistency with JWT payload
//     const userRoles = user.Roles.map((role) => role.name.toLowerCase());
//     console.log("User roles:", userRoles); // Debug log

//     return { userId, roles: userRoles };
//   } catch (error: any) {
//     console.error("Authentication error:", error);
//     throw new UploadThingError(
//       `Unauthorized: Invalid token - ${error.message}`
//     );
//   }
// };

// export const ourFileRouter = {
//   applicationPhotoUploader: f({
//     image: { maxFileSize: "4MB", maxFileCount: 1 },
//   })
//     .middleware(async ({ req }) => {
//       const { userId, roles } = await authenticateUser(req);

//       if (!roles.includes("student")) {
//         console.error(`User ${userId} is not a student`);
//         throw new UploadThingError(
//           "Unauthorized: Only students can upload application photos"
//         );
//       }

//       const applicationId = req.headers.get("x-application-id");
//       if (!applicationId) {
//         console.error("Application ID missing");
//         throw new UploadThingError("Application ID is required");
//       }

//       const application = await prisma.application.findUnique({
//         where: { id: applicationId },
//       });

//       if (!application || application.StudentId !== userId) {
//         console.error(
//           `Invalid application: ${applicationId} for user ${userId}`
//         );
//         throw new UploadThingError("Application not found or unauthorized");
//       }

//       return { userId, applicationId };
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       try {
//         const createdFile = await prisma.file.create({
//           data: {
//             fileName: file.name,
//             fileType: file.type,
//             fileSize: file.size,
//             filePath: file.url,
//             fileCategory: "PHOTOGRAPH",
//             applicationId: metadata.applicationId,
//           },
//         });

//         console.log("Application photo uploaded and saved:", {
//           userId: metadata.userId,
//           applicationId: metadata.applicationId,
//           fileId: createdFile.id,
//           fileUrl: file.url,
//         });

//         return { fileId: createdFile.id, uploadedBy: metadata.userId };
//       } catch (error: any) {
//         console.error("Error saving application photo:", error);
//         throw new UploadThingError(
//           `Failed to save application photo: ${error.message}`
//         );
//       } finally {
//         await prisma.$disconnect();
//       }
//     }),

//   profilePictureUploader: f({
//     image: { maxFileSize: "4MB", maxFileCount: 1 },
//   })
//     .middleware(async ({ req }) => {
//       const { userId, roles } = await authenticateUser(req);

//       if (!roles.includes("student") && !roles.includes("admin")) {
//         console.error(`User ${userId} is neither student nor admin`);
//         throw new UploadThingError(
//           "Unauthorized: Only students and admins can upload profile pictures"
//         );
//       }

//       let userSetting = await prisma.userSetting.findUnique({
//         where: { userId },
//       });

//       if (!userSetting) {
//         console.log(`Creating UserSetting for user ${userId}`);
//         userSetting = await prisma.userSetting.create({
//           data: {
//             userId,
//             theme: "light",
//             language: "en",
//             notificationsEnabled: true,
//           },
//         });
//       }

//       return { userId, userSettingId: userSetting.id };
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       try {
//         const existingFile = await prisma.file.findFirst({
//           where: { userSettingId: metadata.userSettingId },
//         });

//         if (existingFile) {
//           console.log(`Deleting existing file: ${existingFile.id}`);
//           await prisma.file.delete({ where: { id: existingFile.id } });
//         }

//         const createdFile = await prisma.file.create({
//           data: {
//             fileName: file.name,
//             fileType: file.type,
//             fileSize: file.size,
//             filePath: file.url,
//             fileCategory: "PROFILE_PICTURE",
//             userSettingId: metadata.userSettingId,
//           },
//         });

//         console.log("Profile picture uploaded and saved:", {
//           userId: metadata.userId,
//           userSettingId: metadata.userSettingId,
//           fileId: createdFile.id,
//           fileUrl: file.url,
//         });

//         return { fileId: createdFile.id, uploadedBy: metadata.userId };
//       } catch (error: any) {
//         console.error("Error saving profile picture:", error);
//         throw new UploadThingError(
//           `Failed to save profile picture: ${error.message}`
//         );
//       } finally {
//         await prisma.$disconnect();
//       }
//     }),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;
