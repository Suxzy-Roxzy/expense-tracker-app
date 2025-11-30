import { UserType } from "@/validators/types/user";
import {
  UsersSchemaType,
  UpdateUserSchemaType,
} from "../../validators/schemas/user";
import { AxiosInstance } from "../instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// GET
// /api/v1/user/all
// Fetch Users
export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<UsersSchemaType> => {
      const response = await AxiosInstance.get("/api/v1/user/all");
      return response.data;
    },
  });
};

// GET
// /api/v1/user/profile/
// Get Current User
export const useGetCurrentUser = (currentUser_id: string) => {
  return useQuery({
    queryKey: ["currentUser", currentUser_id],
    queryFn: async (): Promise<UserType> => {
      const response = await AxiosInstance.get("/api/v1/user/profile/");
      return response.data;
    },
  });
};

// PUT
// /api/v1/user/update-user
// Update User
type usertypes = {
  updatedUser: UpdateUserSchemaType;
  user_id: string;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ updatedUser, user_id }: usertypes) => {
      const response = await AxiosInstance.put(
        `/api/v1/user/${user_id}`,
        updatedUser
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// POST
// /api/v1/user/change-role
// Change User Role
type changeRoleType = {
  user_id: string;
  newRole: string;
};
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, newRole }: changeRoleType) => {
      const response = await AxiosInstance.post(`/api/v1/user/change-role`, {
        user_id,
        newRole,
      });
      console.log("User role changed:", response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
