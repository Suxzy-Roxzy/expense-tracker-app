import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .refine(
      (val) => {
        return !isNaN(parseFloat(val)) && parseFloat(val) > 0;
      },
      { message: "Amount must be a positive number" }
    ),
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be at most 100 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description must be at most 500 characters" }),
  expense_date: z.string().min(1, { message: "Expense date is required" }),
});
export const updateExpenseSchema =  createExpenseSchema.partial();

// ——————————————————————————————————————————
// Expense Types
// ——————————————————————————————————————————
export type createExpenseSchemaType = z.infer<typeof createExpenseSchema>;
export type updateExpenseSchemaType = z.infer<typeof updateExpenseSchema>;

