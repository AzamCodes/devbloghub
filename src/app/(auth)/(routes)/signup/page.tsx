"use client";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastAction } from "@radix-ui/react-toast";
import { signUpSchema } from "@/lib/signUpSchema";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Inputs = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  // const [user, setUser] = useState({
  //   username: "",
  //   password: "",
  //   email: "",
  // });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(signUpSchema),
  });
  const onSignUp: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      // console.log(data);
      const response = await axios.post("/api/users/signup", data);
      // console.log("SignUp Success", response.data);
      reset();
      toast({
        variant: "popup",
        title: "SignUp Successfully",

        description: "Check Email for Verification",
      });
      router.push("/login");
    } catch (error: any) {
      // console.log("SignUp Failed!", error.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };

  const watchFields = watch(["username", "email", "password"]);
  useEffect(() => {
    const [username, email, password] = watchFields;
    if (username && email && password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [watchFields]);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <>
      <form
        className="flex justify-center px-4 py-28 md:py-16 selection:bg-black selection:text-green-400"
        onSubmit={handleSubmit(onSignUp)}
      >
        <Card className="w-full md:w-[40%] min-h-[70vh] shadow-2xl  md:min-h-[70vh] bg-black/10  rounded-xl backdrop-blur-[100px]   border-none ">
          <CardHeader>
            <CardTitle className="text-green-400 text-2xl">Sign Up</CardTitle>
            <CardDescription className="text-gray-200">
              SignUp to see Recent Posts
            </CardDescription>
          </CardHeader>
          <CardContent className=" flex justify-center flex-col gap-3">
            <Label htmlFor="username">Username</Label>
            <Input
              className="bg-inherit focus:ring-green-600 outline-none placeholder:text-green-300 focus:border-green-600 border-[1.1px]  border-green-700"
              type="text"
              id="username"
              placeholder="username"
              {...register("username")}
            />
            {errors.username?.message && (
              <p className="text-xs md:text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
            <Label htmlFor="email">Email</Label>
            <Input
              className="bg-inherit outline-none placeholder:text-green-300 focus:border-green-600 border-[1.1px]  border-green-700"
              type="email"
              id="email"
              placeholder="email"
              {...register("email")}
            />
            {errors.email?.message && (
              <p className="text-xs md:text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
            <div className="items-center relative">
              <Label htmlFor="password">Password</Label>
              <Input
                className="bg-inherit outline-none placeholder:text-green-300 focus:border-green-600 border-[1.1px]  border-green-700"
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="password"
                {...register("password")}
              />
              <span
                className="absolute right-2 top-[2.1rem]  cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password?.message && (
                <p className="text-xs md:text-sms text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button variant="custom">
              {buttonDisabled ? "No SignUp" : " SignUp Here"}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center items-center ">
            <p>Already Have an account?</p>
            <Button
              variant={"link"}
              className="hover:text-green-400 transition-all"
            >
              <Link href={"/login"}>Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default SignUpPage;
