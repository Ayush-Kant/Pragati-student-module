import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const token = jwt.sign(
  {
    companyId: "11111111-1111-1111-1111-111111111111",
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  },
);

console.log("\nTOKEN:\n");
console.log(token);
