import { PrismaClient } from "@prisma/client";
import invariant from "tiny-invariant";

import { singleton } from "./singleton";

// Hard-code a unique key, so we can look up the client when this module gets re-imported
const prisma = singleton("prisma", getPrismaClient);

function getPrismaClient() {
  const { DATABASE_URL } = process.env;
  invariant(typeof DATABASE_URL === "string", "DATABASE_URL env var not set");

  console.log("🔌 setting up prisma client");
  const client = new PrismaClient();
  client.$connect();

  return client;
}

export { prisma };
