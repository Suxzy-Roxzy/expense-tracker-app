import { UserResponseModel, UserType } from "@/validators/types/user";
import {
  UserUpdateSchemaType,
  UserUpdateSchema,
  changeUserRoleSchemaType,
  changeUserRoleSchema,
} from "../../validators/schemas/user";
import { AxiosInstance, AxiosInstanceWithToken } from "../instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


// GET
// /api/v1/user/all
// Fetch Users
export const useFetchUsers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", "all"],
    queryFn: async (): Promise<UserResponseModel[]> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/user/all");
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error;
    },
  });
};

// GET
// /api/v1/user/profile/
// Get Current User
export const useGetCurrentUser = (enabled: boolean = true) => {
  return useQuery({
    // queryKey: ["currentUser", "profile"],
    queryFn: async (): Promise<UserType> => {
      const response = await AxiosInstanceWithToken.get(
        "/api/v1/user/profile/"
      );
      return response.data;
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// PUT
// /api/v1/user/update-user
// Update User
// type usertypes = {
//   updatedUser: UpdateUserSchemaType;
//   user_id: string;
// };

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserUpdateSchemaType) => {
      const validatedData = UserUpdateSchema.parse(data);
      const response = await AxiosInstanceWithToken.put(
        `/api/v1/user/update-user`,
        validatedData
      );
      return response.data;
    },
    onSuccess: () => {
      // COME BACK TO THIS!!!!!!!
      queryClient.invalidateQueries(["user", "profile"] as any);
      queryClient.invalidateQueries(["user", "all"] as any);
    },
  });
};

// DELETE
// /api/v1/user/delete_user/{user_id}
// Delete User
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user_id: string) => {
      const response = await AxiosInstance.delete(
        `/api/v1/user/delete_user/${user_id}`
      );
    },
    onSuccess: () => {
      // COME BACK TO THIS!!!!!!!
      queryClient.invalidateQueries(["user", "all"] as any);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// POST
// /api/v1/user/change-role
// Change User Role

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: changeUserRoleSchemaType) => {
      const validatedData = changeUserRoleSchema.parse(data);
      const response = await AxiosInstance.post(`/api/v1/user/change-role`, {
        validatedData,
      });
      console.log("User role changed:", response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "all"] as any);
      queryClient.invalidateQueries(["user", "profile"] as any);
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

// GET
// /api/v1/user/activity
// Get User Activity
export const useGetUserActivity = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", "activity"],
    queryFn: async () => {
      const response = await AxiosInstanceWithToken.get(
        "/api/v1/user/activity"
      );
      return response.data; 
    },
    enabled,
    onError: (error: any) => {
      throw error
    }
  });
};
