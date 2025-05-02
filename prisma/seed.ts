import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import argon2 from "argon2";

async function main() {
  try {
    // Create default Roles
    await prisma.role.createMany({
      data: [
        { name: "STUDENT", description: "Default Role for students" },
        { name: "ADMIN", description: "Administrator Role" },
      ],
      skipDuplicates: true,
    });

    // Create permissions for STUDENT Role
    const studentRole = await prisma.role.findFirst({
      where: { name: "STUDENT" },
    });

    if (studentRole) {
      const StudentRole = studentRole; // Alias for consistency
      await prisma.permission.createMany({
        data: [
          {
            name: "CREATE_APPLICATION",
            description: "Create an application",
            roleId: StudentRole.id,
          },
          {
            name: "VIEW_APPLICATION",
            description: "View their applications",
            roleId: StudentRole.id,
          },
        ],
        skipDuplicates: true,
      });
    } else {
      console.warn("STUDENT role not found, skipping permissions.");
    }

    // Create permissions for ADMIN Role
    const adminRole = await prisma.role.findFirst({ where: { name: "ADMIN" } });
    if (adminRole) {
      const AdminRole = adminRole; // Alias for consistency
      await prisma.permission.createMany({
        data: [
          {
            name: "MANAGE_USERS",
            description: "Manage all users",
            roleId: AdminRole.id,
          },
          {
            name: "MANAGE_APPLICATIONS",
            description: "Manage all applications",
            roleId: AdminRole.id,
          },
        ],
        skipDuplicates: true,
      });
    } else {
      console.warn("ADMIN role not found, skipping permissions.");
    }

    // Create or update a default admin user
    const defaultAdminPassword = "Admin123"; // Default password for the admin
    const hashedPassword = await argon2.hash(defaultAdminPassword);
    await prisma.user.upsert({
      where: { Email: "adminjju@gmail.com" }, // Unique field to identify the user
      update: {
        FirstName: "Yoni",
        LastName: "Admas",
        Password: hashedPassword,
        StudentId: "0000",
        Email: "adminjju@gmail.com",
        Year: "2025",
        PhoneNumber: "+251925233133",
        Collage: "Administration",
        Department: "Student Affairs",
      },
      create: {
        FirstName: "Yoni",
        LastName: "Admas",
        Password: hashedPassword,
        StudentId: "0000",
        Email: "adminjju@gmail.com",
        Year: "2025",
        PhoneNumber: "+251925233133",
        Collage: "Administration",
        Department: "Student Affairs",
        Roles: {
          connect: adminRole ? { id: adminRole.id } : undefined, // Safely connect if adminRole exists
        },
        Settings: {
          create: {
            theme: "light",
            language: "en",
            notificationsEnabled: true,
          },
        },
      },
    });

    console.log("Seeding completed successfully!");
    } catch (e: any) {
      console.error("Seeding error:", e);
      throw e; // Re-throw to be caught by the outer catch
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e: any) => {
  console.error("Seeding error:", e);
  process.exit(1);
});

  

// scripts/deleteAllUsers.ts
// async function deleteAllData() {
//   try {
//     // 1. Delete Application Notification relations
//     await prisma.notification.deleteMany({}); // Depends on Application and User

//     // 2. Delete Application-related Files
//     await prisma.file.deleteMany({}); // Depends on Application or UserSetting

//     // 3. Delete Applications
//     await prisma.application.deleteMany({});

//     // 4. Delete User Settings
//     await prisma.userSetting.deleteMany({});

//     // 5. Delete Cards (linked to User)
//     await prisma.card.deleteMany({});

//     // 6. Delete Role relations (many-to-many)
//     await prisma.role.deleteMany({}); // Removes users from roles too

//     // 7. Finally, delete Users
//     const deletedUsers = await prisma.user.deleteMany();
//     console.log(`Deleted ${deletedUsers.count} user(s).`);

//     // Optionally delete PendingApplications, MonthlyHistory, etc.
//     await prisma.pendingApplication.deleteMany();
//     await prisma.monthlyHistory.deleteMany();
//     await prisma.yearlyHistory.deleteMany();
//     await prisma.validStudent.deleteMany();
//   } catch (error) {
//     console.error("Failed to delete data:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }


// async function seed() {
//   // Seed MonthlyHistory for March 2025
//   await prisma.monthlyHistory.createMany({
//     data: [
//       {
//         year: 2025,
//         month: 3,
//         day: 1,
//         Total: 15, // Accepted + Rejected
//         Pending: 0,
//         Accepted: 10,
//         Rejected: 5,
//         createdAt: new Date(),
//       },
//       {
//         year: 2025,
//         month: 3,
//         day: 2,
//         Total: 11,
//         Pending: 0,
//         Accepted: 8,
//         Rejected: 3,
//         createdAt: new Date(),
//       },
//       {
//         year: 2025,
//         month: 3,
//         day: 3,
//         Total: 22,
//         Pending: 0,
//         Accepted: 15,
//         Rejected: 7,
//         createdAt: new Date(),
//       },
//     ],
//   });

//   // Seed YearlyHistory for 2025
//   await prisma.yearlyHistory.createMany({
//     data: [
//       {
//         year: 2025,
//         month: 2, // February
//         Total: 30,
//         Pending: 0,
//         Accepted: 20,
//         Rejected: 10,
//         createdAt: new Date(),
//       },
//       {
//         year: 2025,
//         month: 3, // March
//         Total: 48,
//         Pending: 0,
//         Accepted: 33,
//         Rejected: 15,
//         createdAt: new Date(),
//       },
//     ],
//   });

//   console.log("Seeded history data");
// }

// seed()
//   .catch((e) => console.error(e))
//   .finally(async () => await prisma.$disconnect());