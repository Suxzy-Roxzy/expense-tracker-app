import { z } from "zod";

// {
//   "message": "Expense created successfully",
//   "status": "success",
//   "expense": {
//     "id": "string",
//     "user_id": "string",
//     "title": "string",
//     "amount": 0,
//     "category": "Food",
//     "description": "string",
//     "expense_date": "string",
//     "created_at": "string",
//     "updated_at": "string"
//   }
// }

export const createExpenseSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  amount: z.number(),
  category: z.string(),
  description: z.string(),
  expense_date: z.string(),
});

export const updateExpenseSchema = z.object({
  title: z.string().optional(),
  amount: z.number().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  expense_date: z.string().optional(),
});



export type CreateExpenseType = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseType = z.infer<typeof updateExpenseSchema>;

// export type Fetchinganexpensetype = z.infer<typeof createExpenseSchema>;
