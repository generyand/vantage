"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePostAuthChangePassword, ValidationError } from "@vantage/shared";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

/**
 * Change Password Page
 *
 * This page is shown when a user must change their password.
 * It provides a form for users to enter their current password
 * and set a new password with a modern dashboard-inspired design.
 */
export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, setMustChangePassword } = useAuthStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<{
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
    general?: string;
  }>({});

  // Auto-generated change password mutation hook
  const changePasswordMutation = usePostAuthChangePassword({
    mutation: {
      onSuccess: () => {
        // Update auth store to reflect password change
        setMustChangePassword(false);

        // Redirect to appropriate dashboard based on user role
        const isAdmin =
          user?.role === "SUPERADMIN" || user?.role === "MLGOO_DILG";
        const dashboardPath = isAdmin ? "/mlgoo/dashboard" : "/blgu/dashboard";
        router.replace(dashboardPath);
      },
      onError: (error) => {
        console.error("Password change failed:", error);

        // Handle specific error cases
        if (error?.detail) {
          if (typeof error.detail === "string") {
            setErrors({ general: error.detail });
          } else if (Array.isArray(error.detail)) {
            // Handle validation errors
            const validationErrors: Record<string, string> = {};
            error.detail.forEach((err: ValidationError) => {
              if (err.loc && err.loc.length > 0) {
                const field = String(err.loc[err.loc.length - 1]);
                validationErrors[field] = err.msg || 'Validation error';
              }
            });
            setErrors(validationErrors);
          }
        } else {
          setErrors({
            general: "Failed to change password. Please try again.",
          });
        }
      },
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.current_password) {
      newErrors.current_password = "Current password is required";
    }

    if (!formData.new_password) {
      newErrors.new_password = "New password is required";
    } else if (formData.new_password.length < 8) {
      newErrors.new_password =
        "New password must be at least 8 characters long";
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please confirm your new password";
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (formData.current_password === formData.new_password) {
      newErrors.new_password =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Clear any previous errors
    setErrors({});

    // Submit the form
    changePasswordMutation.mutate({
      data: {
        current_password: formData.current_password,
        new_password: formData.new_password,
      },
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      {/* Top Navigation Bar */}
      <div className="bg-[var(--card)]/80 backdrop-blur-sm border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--cityscape-yellow)] to-[var(--cityscape-yellow-dark)] rounded-sm flex items-center justify-center">
                <Shield className="h-5 w-5 text-[var(--cityscape-accent-foreground)]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[var(--foreground)]">
                  VANTAGE
                </h1>
                <p className="text-xs text-[var(--text-muted)]">Security Portal</p>
              </div>
            </div>

            {/* Header Info */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  Password Security
                </h2>
                <span className="px-3 py-1 bg-[var(--cityscape-yellow)] text-[var(--cityscape-accent-foreground)] text-xs font-medium rounded-sm">
                  Required Action
                </span>
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <Card className="bg-[var(--card)] border border-[var(--border)] shadow-sm rounded-sm overflow-hidden">
              <CardHeader className="px-8 py-6 bg-gradient-to-r from-[var(--muted)] to-[var(--card)]">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--cityscape-yellow)] to-[var(--cityscape-yellow-dark)] rounded-sm flex items-center justify-center">
                    <Lock className="h-6 w-6 text-[var(--cityscape-accent-foreground)]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-[var(--foreground)]">
                      Change Your Password
                    </CardTitle>
                    <CardDescription className="text-[var(--text-secondary)] mt-1">
                      For security reasons, you must update your password before
                      continuing
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-8 py-8">
                {/* General Error Alert */}
                {errors.general && (
                  <Alert
                    variant="destructive"
                    className="mb-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-3">
                                         <Label
                       htmlFor="current_password"
                       className="text-sm font-medium text-[var(--foreground)]"
                     >
                       Current Password
                     </Label>
                     <div className="relative">
                       <Input
                         id="current_password"
                         type={showCurrentPassword ? "text" : "password"}
                         value={formData.current_password}
                         onChange={(e) =>
                           handleInputChange("current_password", e.target.value)
                         }
                         placeholder="Enter your current password"
                         className={`h-12 px-4 pr-12 text-base border rounded-sm transition-all duration-200 ${
                           errors.current_password
                             ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20 focus:border-red-500 focus:ring-red-500/20"
                             : "border-[var(--border)] focus:border-[var(--cityscape-yellow)] focus:ring-[var(--cityscape-yellow)]/20"
                         }`}
                         disabled={changePasswordMutation.isPending}
                       />
                       <button
                         type="button"
                         className="absolute inset-y-0 right-0 w-12 flex items-center justify-center hover:bg-[var(--hover)] rounded-r-sm transition-colors"
                         onClick={() =>
                           setShowCurrentPassword(!showCurrentPassword)
                         }
                       >
                         {showCurrentPassword ? (
                           <EyeOff className="h-5 w-5 text-[var(--text-muted)] hover:text-[var(--foreground)]" />
                         ) : (
                           <Eye className="h-5 w-5 text-[var(--text-muted)] hover:text-[var(--foreground)]" />
                         )}
                       </button>
                     </div>
                     {errors.current_password && (
                       <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                         <AlertCircle className="h-4 w-4 mr-1 text-red-600 dark:text-red-400" />
                         {errors.current_password}
                       </p>
                     )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-3">
                                         <Label
                       htmlFor="new_password"
                       className="text-sm font-medium text-[var(--foreground)]"
                     >
                       New Password
                     </Label>
                     <div className="relative">
                       <Input
                         id="new_password"
                         type={showNewPassword ? "text" : "password"}
                         value={formData.new_password}
                         onChange={(e) =>
                           handleInputChange("new_password", e.target.value)
                         }
                         placeholder="Enter your new password"
                         className={`h-12 px-4 pr-12 text-base border rounded-sm transition-all duration-200 ${
                           errors.new_password
                             ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20 focus:border-red-500 focus:ring-red-500/20"
                             : "border-[var(--border)] focus:border-[var(--cityscape-yellow)] focus:ring-[var(--cityscape-yellow)]/20"
                         }`}
                         disabled={changePasswordMutation.isPending}
                       />
                       <button
                         type="button"
                         className="absolute inset-y-0 right-0 w-12 flex items-center justify-center hover:bg-[var(--hover)] rounded-r-sm transition-colors"
                         onClick={() => setShowNewPassword(!showNewPassword)}
                       >
                         {showNewPassword ? (
                           <EyeOff className="h-5 w-5 text-[var(--text-muted)] hover:text-[var(--foreground)]" />
                         ) : (
                           <Eye className="h-5 w-5 text-[var(--text-muted)] hover:text-[var(--foreground)]" />
                         )}
                       </button>
                     </div>
                     {errors.new_password && (
                       <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                         <AlertCircle className="h-4 w-4 mr-1 text-red-600 dark:text-red-400" />
                         {errors.new_password}
                       </p>
                     )}
                     <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
                       <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                       <span>Password must be at least 8 characters long</span>
                     </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-3">
                                         <Label
                       htmlFor="confirm_password"
                       className="text-sm font-medium text-[var(--foreground)]"
                     >
                       Confirm New Password
                     </Label>
                     <div className="relative">
                       <Input
                         id="confirm_password"
                         type={showConfirmPassword ? "text" : "password"}
                         value={formData.confirm_password}
                         onChange={(e) =>
                           handleInputChange("confirm_password", e.target.value)
                         }
                         placeholder="Confirm your new password"
                         className={`h-12 px-4 pr-12 text-base border rounded-sm transition-all duration-200 ${
                           errors.confirm_password
                             ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20 focus:border-red-500 focus:ring-red-500/20"
                             : "border-[var(--border)] focus:border-[var(--cityscape-yellow)] focus:ring-[var(--cityscape-yellow)]/20"
                         }`}
                         disabled={changePasswordMutation.isPending}
                       />
                       <button
                         type="button"
                         className="absolute inset-y-0 right-0 w-12 flex items-center justify-center hover:bg-[var(--hover)] rounded-r-sm transition-colors"
                         onClick={() =>
                           setShowConfirmPassword(!showConfirmPassword)
                         }
                       >
                         {showConfirmPassword ? (
                           <EyeOff className="h-5 w-5 text-[var(--text-muted)] hover:text-[var(--foreground)]" />
                         ) : (
                           <Eye className="h-5 w-5 text-[var(--text-muted)] hover:text-[var(--foreground)]" />
                         )}
                       </button>
                     </div>
                     {errors.confirm_password && (
                       <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                         <AlertCircle className="h-4 w-4 mr-1 text-red-600 dark:text-red-400" />
                         {errors.confirm_password}
                       </p>
                     )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                                         <Button
                       type="submit"
                       className="w-full h-10 bg-gradient-to-r from-[var(--cityscape-yellow)] to-[var(--cityscape-yellow-dark)] hover:from-[var(--cityscape-yellow-dark)] hover:to-[var(--cityscape-yellow-darker)] text-[var(--cityscape-accent-foreground)] font-medium text-sm rounded-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                       disabled={changePasswordMutation.isPending}
                     >
                      {changePasswordMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <span>Update Password</span>
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

                     {/* Right Sidebar */}
           <div className="space-y-6">
             {/* Security Status Card */}
             <Card className="bg-[var(--card)] border border-[var(--border)] shadow-sm rounded-sm overflow-hidden">
               <CardHeader className="px-6 py-5 bg-gradient-to-r from-[var(--muted)] to-[var(--card)]">
                 <CardTitle className="text-lg font-semibold text-[var(--foreground)] flex items-center">
                   <Shield className="h-5 w-5 mr-3 text-[var(--cityscape-yellow)]" />
                   Security Status
                 </CardTitle>
               </CardHeader>
               <CardContent className="px-6 py-6">
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-[var(--text-secondary)]">
                       Password Status
                     </span>
                     <span className="px-3 py-1 bg-[var(--cityscape-yellow)] text-[var(--cityscape-accent-foreground)] text-xs font-medium rounded-sm">
                       Requires Update
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-[var(--text-secondary)]">Last Updated</span>
                     <span className="text-sm text-[var(--foreground)]">Never</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-[var(--text-secondary)]">
                       Account Status
                     </span>
                     <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded-sm">
                       Active
                     </span>
                   </div>
                 </div>
               </CardContent>
             </Card>

                         {/* Security Tips Card */}
             <Card className="bg-gradient-to-br from-[var(--muted)] to-[var(--card)] border border-[var(--border)] shadow-sm rounded-sm overflow-hidden">
               <CardHeader className="px-6 py-5">
                 <CardTitle className="text-lg font-semibold text-[var(--foreground)] flex items-center">
                   <CheckCircle className="h-5 w-5 mr-3 text-[var(--cityscape-yellow)]" />
                   Security Tips
                 </CardTitle>
               </CardHeader>
               <CardContent className="px-6 py-6">
                 <div className="space-y-4">
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-[var(--cityscape-yellow)] rounded-full mt-2 flex-shrink-0"></div>
                     <p className="text-sm text-[var(--foreground)]">
                       Use a combination of letters, numbers, and symbols
                     </p>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-[var(--cityscape-yellow)] rounded-full mt-2 flex-shrink-0"></div>
                     <p className="text-sm text-[var(--foreground)]">
                       Avoid using personal information like birthdays
                     </p>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-[var(--cityscape-yellow)] rounded-full mt-2 flex-shrink-0"></div>
                     <p className="text-sm text-[var(--foreground)]">
                       Make it at least 8 characters long
                     </p>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-[var(--cityscape-yellow)] rounded-full mt-2 flex-shrink-0"></div>
                     <p className="text-sm text-[var(--foreground)]">
                       Don&apos;t reuse passwords from other accounts
                     </p>
                   </div>
                 </div>
               </CardContent>
             </Card>

                         {/* User Info Card */}
             <Card className="bg-[var(--card)] border border-[var(--border)] shadow-sm rounded-sm overflow-hidden">
               <CardContent className="px-6 py-6">
                 <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 bg-gradient-to-br from-[var(--cityscape-yellow)] to-[var(--cityscape-yellow-dark)] rounded-sm flex items-center justify-center">
                     <span className="text-[var(--cityscape-accent-foreground)] text-lg font-bold">
                       {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                     </span>
                   </div>
                   <div>
                     <p className="font-semibold text-[var(--foreground)]">
                       {user?.name || "User"}
                     </p>
                     <p className="text-sm text-[var(--text-secondary)]">
                       {user?.role || "User"}
                     </p>
                   </div>
                 </div>
               </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
