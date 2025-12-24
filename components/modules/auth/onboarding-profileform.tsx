"use client";
import { useGetCurrentUser, useUpdateUser } from "@/data/endpoints/user";
import {
  UserUpdateSchema,
  UserUpdateSchemaType,
} from "@/validators/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Custom Components
import AvatarUploader from "@/components/custom/avatar-upload";
import { UploadFile } from "@/data/endpoints/files";
import LocationSelector from "@/components/custom/location-select";
import { Label } from "../../ui/label";
import SubmissionButton from "@/components/custom/submission-button";
import { EmptyPageLoading } from "@/components/custom/empty-page-loading";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/base-phone-input";
import { Input } from "@base-ui-components/react/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormProps {
  // Define any props if needed
  className?: string;
}

const OnboardingPageForm: React.FC<ProfileFormProps> = ({ className }) => {
  const router = useRouter();
  const { data: userProfile, isLoading: profileLoading } = useGetCurrentUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const [updating, setUpdating] = useState(false);
  const form = useForm<UserUpdateSchemaType>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      state: "",
      country: "",
      avatar: "",
      bio: "",
      gender: "",
      profile_completed: false,
    },
  });

  // Populate form with User data when Available
  useEffect(() => {
    if (userProfile) {
      form.reset({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        state: userProfile.state || "",
        country: userProfile.country || "",
        avatar: userProfile.avatar || "",
        bio: userProfile.bio || "",
        gender: userProfile.gender || "",
        profile_completed: userProfile.profile_completed,
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (data: UserUpdateSchemaType) => {
    setUpdating(true);
    try {
      // Set profile as completed before submission
      const updatedData = {
        ...data,
        profile_completed: true,
      };

      if (updatedData.avatar && updatedData.avatar instanceof File) {
        // Upload the new Avatar file and Send to back end
        const uploadResponse = await UploadFile(updatedData.avatar);
        updatedData.avatar = uploadResponse.url;
      } else if (updatedData.avatar === null) {
        updatedData.avatar = " ";
      }
      // console.log("submitting updated profile data:", updatedData)
      await updateUser(updatedData);
      toast.success("profile updated successfully!");
      router.push("/");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (profileLoading) {
    return (
      <EmptyPageLoading
        label="Loading Profile"
        description=" Please wait while we fetch you data.."
      />
    );
  }

  return (
    <div>
      <div className={cn("flex flex-col gap-6", className)}>
        <Card>
          <CardContent>
            <div className="mb-6 px-3">
              <h5 className="text-xl font-bold text-primary dark:text-white">
                Complete Your profile
              </h5>
              <div className="text-xl font-bold text-muted-foreground">
                Tell Us More About YourSelf 😊 To Personalize YourSelf.
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Avatar Upload area */}
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-center">
                        <div className="flex flex-col items-center ">
                          <FormLabel className="mb-2">profile Avatar</FormLabel>
                          <FormControl>
                            <AvatarUploader
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Phone number Area */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          {...field}
                          value={field.value || ""}
                          popupClassName="w-[300px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location Selector */}
                <div className="space-y-4">
                  <Label>Location</Label>
                  <LocationSelector
                    defaultCountry={form.watch("country")}
                    defaultState={form.watch("state")}
                    onCountryChange={(country) => {
                      form.setValue("country", country?.name || "");
                    }}
                    onStateChange={(state) => {
                      form.setValue("state", state?.name || "");
                    }}
                  />
                </div>

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          placeholder="Enter Your address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        key={field.value || ""} //To reset when value changes
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Your gender" />
                          </SelectTrigger>
                        </FormControl>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Bio */}
                <FormField
                control={form.control}
                name="bio"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Tell us more about yourself...."
                      rows={4}
                      className="resize-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
                />

                {/* Submit Button */}
                <div>
                  <SubmissionButton
                  isSubmitting={updating}
                  label="Update Profile"
                  />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPageForm;
