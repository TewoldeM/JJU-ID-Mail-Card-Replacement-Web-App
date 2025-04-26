
// import { PrismaClient } from "@prisma/client";
// import argon2 from "argon2"; // Ensure this is installed: npm install argon2

// const prisma = new PrismaClient();

// async function main() {
//   try {
//     // Create default Roles
//     await prisma.role.createMany({
//       data: [
//         { name: "STUDENT", description: "Default Role for students" },
//         { name: "ADMIN", description: "Administrator Role" },
//       ],
//       skipDuplicates: true,
//     });

//     // Create permissions for STUDENT Role
//     const studentRole = await prisma.role.findFirst({
//       where: { name: "STUDENT" },
//     });

//     if (studentRole) {
//       const StudentRole = studentRole; // Alias for consistency
//       await prisma.permission.createMany({
//         data: [
//           {
//             name: "CREATE_APPLICATION",
//             description: "Create an application",
//             roleId: StudentRole.id,
//           },
//           {
//             name: "VIEW_APPLICATION",
//             description: "View their applications",
//             roleId: StudentRole.id,
//           },
//         ],
//         skipDuplicates: true,
//       });
//     } else {
//       console.warn("STUDENT role not found, skipping permissions.");
//     }

//     // Create permissions for ADMIN Role
//     const adminRole = await prisma.role.findFirst({ where: { name: "ADMIN" } });
//     if (adminRole) {
//       const AdminRole = adminRole; // Alias for consistency
//       await prisma.permission.createMany({
//         data: [
//           {
//             name: "MANAGE_USERS",
//             description: "Manage all users",
//             roleId: AdminRole.id,
//           },
//           {
//             name: "MANAGE_APPLICATIONS",
//             description: "Manage all applications",
//             roleId: AdminRole.id,
//           },
//         ],
//         skipDuplicates: true,
//       });
//     } else {
//       console.warn("ADMIN role not found, skipping permissions.");
//     }

//     // Create or update a default admin user
//     const defaultAdminPassword = "Admin123"; // Default password for the admin
//     const hashedPassword = await argon2.hash(defaultAdminPassword);
//     await prisma.user.upsert({
//       where: { Email: "adminjju@gmail.com" }, // Unique field to identify the user
//       update: {
//         FirstName: "Yoni",
//         LastName: "Admas",
//         Password: hashedPassword,
//         StudentId: "0000",
//         Email: "adminjju@gmail.com",
//         Year: "2025",
//         PhoneNumber: "+251925233133",
//         Collage: "Administration",
//         Department: "Student Affairs",
//       },
//       create: {
//         FirstName: "Yoni",
//         LastName: "Admas",
//         Password: hashedPassword,
//         StudentId: "0000",
//         Email: "adminjju@gmail.com",
//         Year: "2025",
//         PhoneNumber: "+251925233133",
//         Collage: "Administration",
//         Department: "Student Affairs",
//         Roles: {
//           connect: adminRole ? { id: adminRole.id } : undefined, // Safely connect if adminRole exists
//         },
//         Settings: {
//           create: {
//             theme: "light",
//             language: "en",
//             notificationsEnabled: true,
//           },
//         },
//       },
//     });

//     console.log("Seeding completed successfully!");
//     console.error("Seeding error:", e);
//     throw e; // Re-throw to be caught by the outer catch
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main().catch((e: any) => {
//   console.error("Seeding error:", e);
//   process.exit(1);
// });

  