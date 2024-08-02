"use client"; // Ensure this component is treated as a client-side component

import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginSchema } from "@/lib/loginSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { toast, useToast } from "@/components/ui/use-toast";

type Inputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { setUser, fetchUserDetails } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
  });

  const onLogIn: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/users/login", data);
      const { success, user } = response.data;

      if (success !== 200) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid Credentials",
        });
      } else {
        setUser(user); // Update context user
        await fetchUserDetails(); // Ensure context is up-to-date
        router.push("/blog");
        toast({
          variant: "popup",
          title: "Logged In Successfully!",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.response?.data?.error || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const watchFields = watch(["email", "password"]);
  useEffect(() => {
    const [email, password] = watchFields;
    setButtonDisable(!(email && password));
  }, [watchFields]);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <>
      <div>
        <Image
          src={"/tortoise-shell.png"}
          alt="bg-image"
          layout="fill"
          className="brightness-50"
          objectFit="cover"
        />
      </div>
      <form
        onSubmit={handleSubmit(onLogIn)}
        className="flex justify-center px-4 py-28 md:py-16 selection:bg-gray-600 selection:text-green-500"
      >
        <Card className="w-full md:w-[40%] min-h-full shadow-2xl md:min-h-[70vh] bg-black/5 rounded-xl backdrop-blur-[100px] border-none">
          <CardHeader>
            <CardTitle className="text-green-500 text-2xl">
              {loading ? "Processing" : "Login"}
            </CardTitle>
            <CardDescription className="text-gray-200">
              Please Login To Verify
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center flex-col gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              className="bg-inherit focus:ring-green-600 outline-none placeholder:text-green-300 focus:border-green-600 border-[1.1px] border-green-700"
              type="email"
              id="email"
              placeholder="email"
              {...register("email")}
            />
            {errors.email?.message && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
            <div className="items-center relative">
              <Label htmlFor="password">Password</Label>
              <Input
                className="bg-inherit focus:ring-green-600 outline-none placeholder:text-green-300 focus:border-green-600 border-[1.1px] border-green-700"
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="password"
                {...register("password")}
              />
              <span
                className="absolute right-2 top-[2.1rem] items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password?.message && (
                <p className="text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button disabled={buttonDisable} variant="custom">
              {buttonDisable ? "No Login" : "Login"}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button
              variant="link"
              className="hover:text-green-400 text-xs md:text-sm transition-all"
            >
              <Link href="/emailforgotpass">Forgot Password?</Link>
            </Button>
            <span className="gap-[2px] md:gap-2 text-xs md:text-sm flex items-center">
              <p className="text-nowrap items-center">
                Don&apos;t Have an account?
              </p>
              <Link
                className="hover:text-green-400 hover:underline-offset-1 hover:underline transition-all"
                href="/signup"
              >
                SignUp
              </Link>
            </span>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default LoginPage;
