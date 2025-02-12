import { prisma } from "~/.server/db";
import { hashPassword } from "~/utils/";

async function seed(): Promise<void> {
  console.log("Seeding database...");
  console.time("Seeded database");

  try {
    console.time("Cleaning database");
    await prisma.user.deleteMany();
    console.timeEnd("Cleaning database");

    console.time("Created user");
    await prisma.user.create({
      data: {
        firstName: "Matt",
        lastName: "Millard",
        username: "mattmillard",
        email: "matt.millard@gmail.com",
        password: {
          create: {
            hash: hashPassword("Password123!"),
          },
        },
      },
    });
    console.timeEnd("Created user");

    console.log("Database seeded successfully!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Seeding error:", error.message);
    } else {
      console.error("An unknown error occurred during seeding:", error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.timeEnd("Seeded database");
  }
}

seed();
