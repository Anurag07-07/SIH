import { z } from "zod";

export const UserValidation = z.object({
  username:z.string().min(4).max(20),
  password:z.string().min(5).max(20).regex(/[A-Z]/),
  email:z.string().min(5).max(20),
  Phone:z.number().min(10).max(12),
  photo:z.string()
})