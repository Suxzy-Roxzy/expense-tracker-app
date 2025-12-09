import {z} from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

export const ProfileImageSchema = z.union([
    z.instanceof(File)
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      message: "Image size should be less than 5MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Unsupported image format. Accepted formats: JPEG, JPG, PNG, GIF",
    }),
    z.string(),
    z.null(),
])