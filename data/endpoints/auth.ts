import { AxiosInstance } from "../instance";
import { SendEmailSchema, SendEmailType } from "../../validators/schemas/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { use } from "react";

// POST
// /api/v1/auth/send_mail
// Send Mail
export const useSendMail = () => {
  return useMutation({
    mutationFn: async (data: SendEmailType) => {
      const response = await AxiosInstance.post("/api/v1/auth/send_mail", data);
      return response.data;
    },
    onSuccess: () => {
      console.log("Email sent successfully");
    },
  });
};


