import {
  createExpenseSchema,
  createExpenseSchemaType,
  updateExpenseSchemaType,
} from "@/validators/schemas/expense.js";
import { AxiosInstance, AxiosInstanceWithToken } from "../instance.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExpensesWithFilter } from "@/validators/types/expense.js";

// POST
// /api/v1/expenses/
// Create a new expense
export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: createExpenseSchemaType) => {
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/expenses/",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // COME BACK TO THIS AND FIX THE ANY!!!!!!
      queryClient.invalidateQueries(["expenses"] as any);
      queryClient.invalidateQueries(["expenses-analytics"] as any);
    },
  });
};

// GET
// /api/v1/expenses/
// Get all expenses with filters
export const useFetchExpenses = (params?: ExpensesWithFilter) => {
  return useQuery({
    queryKey: ["expenses", params],
    queryFn: async () => {
      const response = await AxiosInstanceWithToken.get("/api/v1/expenses/", {
        params,
      });
      return response.data;
    },
  });
};

// GET
// /api/v1/expenses/{expense_id}
// Get a specific expense

export const useFetchExpenseById = (expense_id: string, enabled: true) => {
  return useQuery({
    queryKey: ["expense", expense_id],
    queryFn: async () => {
      const response = await AxiosInstance.get(
        `/api/v1/expenses/${expense_id}`
      );
      return response.data;
    },
    enabled, //enabled && expense_id (to be out in here later if needed),
  });
};

// PATCH
// /api/v1/expenses/{expense_id}
// Update an expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      expense_id,
    }: {
      data: updateExpenseSchemaType;
      expense_id: string;
    }) => {
      const response = await AxiosInstanceWithToken.patch(
        `/api/v1/expenses/${expense_id}`,
        data
      );
      return response.data;
    },
    onSuccess: (variable) => {
      // COME BACK TO THIS AND FIX THE ANY!!!!!!
      queryClient.invalidateQueries(["expenses"] as any);
      queryClient.invalidateQueries(["expense", variable.expense_id] as any);
      queryClient.invalidateQueries(["expenses-analytics"] as any);
    },
  });
};

// DELETE
// /api/v1/expenses/{expense_id}
// Delete an expense
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expense_id: string) => {
      const response = await AxiosInstance.delete(
        `/api/v1/expenses/${expense_id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

// GET
// /api/v1/expenses/analytics/by-category
// Get spending by category
export const useFetchSpendingByCategory = (
  user_id: string,
  start_date: string,
  end_date: string
) => {
  return useQuery({
    queryKey: ["spendingByCategory", user_id, start_date, end_date],
    queryFn: async (): Promise<Record<string, number>> => {
      const response = await AxiosInstance.get(
        `/api/v1/expenses/analytics/by-category`,
        {
          params: { user_id, start_date, end_date },
        }
      );
      return response.data;
    },
  });
};

// GET
// /api/v1/expenses/analytics/summary
// Get spending summary
export const useFetchSpendingSummary = (
  user_id: string,
  start_date: string,
  end_date: string
) => {
  return useQuery({
    queryKey: ["spendingSummary", user_id, start_date, end_date],
    queryFn: async (): Promise<{
      total_spent: number;
      average_daily_spent: number;
    }> => {
      const response = await AxiosInstance.get(
        `/api/v1/expenses/analytics/summary`,
        {
          params: { user_id, start_date, end_date },
        }
      );
      return response.data;
    },
  });
};

// GET
// /api/v1/expenses/analytics/monthly/{year}/{month}
// Get monthly statistics
export const useFetchMonthlyStatistics = (
  user_id: string,
  year: number,
  month: number
) => {
  return useQuery({
    queryKey: ["monthlyStatistics", user_id, year, month],
    queryFn: async (): Promise<{
      year: number;
      month: number;
    }> => {
      const response = await AxiosInstance.get(
        `/api/v1/expenses/analytics/monthly/${year}/${month}`,
        {
          params: { user_id },
        }
      );
      return response.data;
    },
  });
};

// GET
// /api/v1/expenses/analytics/visualization
// Get data for time-series visualization/charts
export const useFetchTimeSeriesData = (
  user_id: string,
  period_type: string,
  limit: number
) => {
  return useQuery({
    queryKey: ["timeSeriesData", user_id, period_type, limit],
    queryFn: async (): Promise<{ date: string; total_amount: number }[]> => {
      const response = await AxiosInstance.get(
        `/api/v1/expenses/analytics/visualization`,
        {
          params: { user_id, period_type, limit },
        }
      );
      return response.data;
    },
  });
};

// GET
// /api/v1/expenses/analytics/category-chart
// Get data for category-based visualization/charts
export const useFetchCategoryChartData = (
  user_id: string,
  start_date: string,
  end_date: string
) => {
  return useQuery({
    queryKey: ["categoryChartData", user_id, start_date, end_date],
    queryFn: async (): Promise<
      { category: string; total_amount: number }[]
    > => {
      const response = await AxiosInstance.get(
        `/api/v1/expenses/analytics/category-chart`,
        {
          params: { user_id, start_date, end_date },
        }
      );
      return response.data;
    },
  });
};

// GET
// /api/v1/expenses/categories/list
// Get all available categories
export const useFetchExpenseCategories = () => {
  return useQuery({
    queryKey: ["expenseCategories"],
    queryFn: async (): Promise<string[]> => {
      const response = await AxiosInstance.get(
        `/api/v1/expenses/categories/list`
      );
      return response.data;
    },
  });
};
