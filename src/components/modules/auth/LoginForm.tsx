"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, User } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { loginSchema, LoginInput } from "@/lib/validations/auth.schema";
import { useLoginMutation } from "@/store/api/auth.api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth.slice";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      const res = await login(values).unwrap();

      dispatch(
        setCredentials({
          user: res.user,
        })
      );

      toast.success("Login successful");

      if (res.user.role == "member") {
        router.push("/dashboard/member");
      } else {
        router.push("/dashboard/admin");
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Invalid credentials");
    }
  };

  // ✅ DEMO CREDENTIALS (ONLY UI FEATURE)
  const fillAdmin = () => {
    form.setValue("email", "admin@email.com");
    form.setValue("password", "12345678");
    toast.info("Admin credentials filled");
  };

  const fillMember = () => {
    form.setValue("email", "member1@gmail.com");
    form.setValue("password", "12345678");
    toast.info("Member credentials filled");
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur rounded-2xl">

      {/* HEADER */}
      <CardHeader className="text-center space-y-3 pb-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg">
          <Lock className="h-7 w-7 text-white" />
        </div>

        <CardTitle className="text-3xl font-bold">
          Welcome Back
        </CardTitle>

        <CardDescription>
          Sign in to continue to your dashboard
        </CardDescription>
      </CardHeader>

      {/* FORM */}
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin@email.com"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DEMO BUTTONS */}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillAdmin}
                className="w-full border-dashed"
              >
                <User className="h-3.5 w-3.5 mr-2" />
                Admin
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillMember}
                className="w-full border-dashed"
              >
                <User className="h-3.5 w-3.5 mr-2" />
                Member
              </Button>
            </div>

            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full h-11 font-semibold mt-2"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}