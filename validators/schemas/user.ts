import { z } from "zod";
import {ProfileImageSchema} from "@/validators/schemas/custom-validation"
import {isValidPhoneNumber} from "react-phone-number-input"


// Zod validation Schema for Users
export const UserSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  phone: z.string(),
  avatar: z.string(),
  gender: z.string(),
  role: z.string(),
});
export const UsersSchema = z.array(UserSchema);

export const UserUpdateSchema = z.object({
  first_name: z.string(),
  last_name: z.string().nullable().optional(),
  email: z.email().nullable().optional(),
  phone: z.string().refine(isValidPhoneNumber, {
    message: "Please enter a valid phone number",
  }),
  address: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  avatar: ProfileImageSchema,
  bio: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  profile_completed: z.boolean().nullable().optional(),
});

export const changeUserRoleSchema = z.object({
  newRole: z.string(),
  user_id: z.string(),
});

// Types of Users
export type CreateUserSchemaType = z.infer<typeof UserSchema>;
export type UpdateUserSchemaType = Partial<CreateUserSchemaType>;
export type UsersSchemaType = z.infer<typeof UsersSchema>;
export type UserUpdateSchemaType = z.infer<typeof UserUpdateSchema>;
export type changeUserRoleSchemaType = z.infer<typeof changeUserRoleSchema>

// {
//   "id": "string",
//   "first_name": "string",
//   "last_name": "string",
//   "email": "user@example.com",
//   "phone": "string",
//   "address": "string",
//   "state": "string",
//   "country": "string",
//   "avatar": "string",
//   "bio": "string",
//   "gender": "string",
//   "role": "user",
//   "is_verified": false,
//   "two_factor_enabled": false,
//   "is_oauth": false,
//   "created_at": "string"
// }

// export const UserSchema = z.object({
//   id: z.string(),
//   first_name: z.string(),
//   last_name: z.string(),
//   email: z.email(),
//   phone: z.string(),
//   address: z.string(),
//   state: z.string(),
//   country: z.string(),
//   avatar: z.string(),
//   bio: z.string(),
//   gender: z.string(),
//   role: z.string(),
//   is_verified: z.boolean(),
//   two_factor_enabled: z.boolean(),
//   is_oauth: z.boolean(),
//   created_at: z.string(),
// });
