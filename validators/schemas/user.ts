import { z } from "zod";

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

// Types of Users
export type CreateUserSchemaType = z.infer<typeof UserSchema>;
export type UpdateUserSchemaType = Partial<CreateUserSchemaType>;
export type UsersSchemaType = z.infer<typeof UsersSchema>;



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
