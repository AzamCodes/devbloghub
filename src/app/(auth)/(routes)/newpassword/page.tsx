"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import forgotPasswordSchema from "@/lib/forgotPasswordSchema";
import { z } from "zod";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const NewPassword = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  type Inputs = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const newPass: SubmitHandler<Inputs> = async (data) => {
    try {
      // console.log(data);
      const response = await axios.post("/api/users/forgotPass", {
        data,
      });
      // console.log(token);
      // console.log(response.data);
      reset();
      toast({
        variant: "popup",
        title: "Password Update Successfully",

        description: "Login with your Update Password",
      });
      router.push("/login");
    } catch (error: any) {
      // console.log(error.message);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
    setValue("token", urlToken || "");
  }, [setValue]);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <div>
      <Image
        src={"/tortoise-shell.png"}
        alt="bg-image"
        layout="fill"
        className="brightness-50"
        objectFit="cover"
      />
      <form onSubmit={handleSubmit(newPass)}>
        <div className="flex justify-center px-4 py-32 md:py-32 selection:bg-black selection:text-green-500 ">
          {" "}
          <Card className="w-full md:w-[40%] min-h-full shadow-2xl  md:min-h-[45vh] bg-black/5  rounded-xl backdrop-blur-[100px]   border-none ">
            <CardHeader>
              <CardTitle className="text-green-500 text-2xl">
                {loading ? "Processing" : "SetUp New Password"}{" "}
              </CardTitle>
            </CardHeader>
            <CardContent className=" flex justify-center flex-col gap-2">
              <div className="items-center relative">
                <Label htmlFor="password">New Password</Label>
                <Input
                  className="bg-inherit focus:ring-green-600 outline-none placeholder:text-green-300 focus:border-green-600 border-[1.1px]  border-green-700"
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  {...register("pass", { required: true })}
                  placeholder="Enter New Password"
                />{" "}
                <span
                  className="absolute right-2 top-[2.1rem] items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.pass?.message && (
                  <p className="text-sm text-red-400">{errors.pass.message}</p>
                )}
              </div>
              <div className="items-center relative">
                <Label htmlFor="password">Confirm Password</Label>
                <Input
                  className="bg-inherit focus:ring-green-600 outline-none placeholder:text-green-300 focus:border-green-600 border-[1.1px]  border-green-700"
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  {...register("confirmp", { required: true })}
                  placeholder="Confirm New Password"
                />
                <span
                  className="absolute right-2 top-[2.1rem] items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.confirmp?.message && (
                  <p className="text-sm text-red-400">
                    {errors.confirmp.message}
                  </p>
                )}
              </div>
              <Button className="mt-3" variant="custom">
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default NewPassword;
