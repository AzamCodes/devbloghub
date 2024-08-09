"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SendEmailForgotpassSchema } from "@/lib/SendEmailforgotpassSchema";
import axios from "axios";

const EmailforgotPass = () => {
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const { toast } = useToast();
  const router = useRouter();

  const [buttonDisable, setButtonDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  type Inputs = z.infer<typeof SendEmailForgotpassSchema>;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(SendEmailForgotpassSchema),
  });

  const shootmail: SubmitHandler<Inputs> = async (email) => {
    try {
      // console.log(email);
      const response = await axios.post("/api/users/emailforgotpass", {
        email,
      });
      reset();
      toast({
        variant: "popup",
        title: "Email Send Successfully",

        description: "Check Email to Setup a New Password",
      });
      // console.log("Shoot mail success", response.data);
    } catch (error: any) {
      // console.log(error.message);
    }
  };

  const watchFields = watch(["email"]);

  useEffect(() => {
    const [email] = watchFields;

    if (
      (typeof email === "string" && email.length > 0) ||
      (typeof email === "number" && email > 0)
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [watchFields]);
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
        <form onSubmit={handleSubmit(shootmail)}>
          <div className="flex justify-center px-4 py-32 md:py-32 selection:bg-black selection:text-green-500 ">
            {" "}
            <Card className="w-full md:w-[40%] min-h-full shadow-2xl  md:min-h-[45vh] bg-black/5  rounded-xl backdrop-blur-[100px]   border-none ">
              <CardHeader>
                <CardTitle className="text-green-500 text-2xl">
                  {loading ? "Processing" : "Email"}{" "}
                </CardTitle>
                <CardDescription className="text-gray-200">
                  Send Email for setup New Password
                </CardDescription>
              </CardHeader>
              <CardContent className=" flex justify-center flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="bg-inherit focus:ring-green-600 outline-none placeholder:text-green-300 focus:border-green-600 border-[1.1px]  border-green-700"
                  type="email"
                  id="email"
                  {...register("email")}
                />
                {errors.email?.message && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}

                <Button className="mt-3" variant="custom">
                  Send
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </>
  );
};

export default EmailforgotPass;
