// Types for fetching expenses with filters and pagination

// category: Filter by expense category
// start_date: Get expenses from this date onwards
// end_date: Get expenses until this date
// search: Search in expense title and description
// page: Page number for pagination
// page_size


export type ExpensesWithFilter = {
  category?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  page_size?: number;
};








