import React from "react";
import { AxiosInstanceMultipartWithToken } from "../instance";

// Upload a Single File
export const UploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", file.name);
  formData.append("replace", "true");
  const response = await AxiosInstanceMultipartWithToken.post(
    "/api/v1/file/upload",
    formData
  );
  return response.data;
};

// Upload Multiple Files
export const uploadMultipleFiles = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
    formData.append("keys", file.name);
    formData.append("replace", "true");
  });
  const response = await AxiosInstanceMultipartWithToken.post(
    "/api/v1/file/upload/multiple",
    formData
  );
  return response.data;
};

// Delete a File by Key
export const useDeleteFile = async (file_url: string) => {
  const response = await AxiosInstanceMultipartWithToken.delete(
    "/api/v1/file/delete/", {data:{
        file_url
    }}
  );
  return response.data;
};