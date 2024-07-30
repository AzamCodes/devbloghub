"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     {/* <Button variant="outline" size="icon"> */}
    //     <div className="flex">
    //       <SunIcon className="h-[1.6rem] w-[1.6rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    //       <MoonIcon className="absolute h-[1.6rem] border-none w-[1.6rem] bg-transparent rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    //     </div>
    //     {/* <span className="sr-only">Toggle theme</span>
    //     </Button> */}
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end">
    //     <DropdownMenuItem onClick={() => setTheme("light")}>
    //       Light
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("dark")}>
    //       Dark
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <div className="flex">
      <Button variant={"outline"}>
        <SunIcon
          onClick={() => setTheme("dark")}
          className="rounded-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <MoonIcon
          onClick={() => setTheme("light")}
          className="absolute  w-[1.6rem] bg-transparent rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
      </Button>
    </div>
  );
}
