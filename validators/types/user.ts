

// ———————————————————————————————————————————
// User Types
// ———————————————————————————————————————————
export interface UserResponseModel {
  id: string;
  first_name: string;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  avatar?: string | null;
  gender?: string | null;
  role: "Super_Admin" | "Admin" | "Business_User" | "Standard_User";
  profile_completed: boolean;
  is_verified: boolean;
  fcmtoken?: string | null;
}

export interface UserType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  country: string;
  avatar: string;
  bio: string;
  gender: string;
  role: string;
  is_verified: boolean;
  two_factor_enabled: boolean;
  is_oauth: boolean;
  created_at: string;
}

export type UsersType = UserType[];
export type fetchingUsersType = Partial<UsersType>; 


  // id: string;
  // first_name: string;
  // last_name: "string";
  // email: "user@example.com";
  // phone: "string";
  // avatar: "string";
  // gender: "string";
  // role: "user";
