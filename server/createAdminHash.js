<<<<<<< HEAD
import "dotenv/config";
import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

try {
  const password = await rl.question("Enter your admin password: ");

  if (password.length < 12) {
    throw new Error("Use a password with at least 12 characters.");
  }

  const hash = await bcrypt.hash(password, 12);
  console.log("\nYour password hash:\n");
  console.log(hash);
} finally {
  rl.close();
=======
import "dotenv/config";
import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

try {
  const password = await rl.question("Enter your admin password: ");

  if (password.length < 12) {
    throw new Error("Use a password with at least 12 characters.");
  }

  const hash = await bcrypt.hash(password, 12);
  console.log("\nYour password hash:\n");
  console.log(hash);
} finally {
  rl.close();
>>>>>>> e84dfdfdaee441a71dbbe5ab2b3f71162b6deb50
}