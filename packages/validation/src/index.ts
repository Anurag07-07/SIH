import { z } from "zod";

export const UserValidation = z.object({
  username:z.string().min(4).max(20),
  password:z.string().min(5).max(20),
  email:z.string().min(5).max(50),
  Phone:z.string().min(10).max(12),
  photo:z.string()
})