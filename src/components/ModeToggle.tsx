"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="default"
      size={"icon"}
      className="relative p-2"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <SunIcon className="sm:h-[1.2rem] h-[1rem] w-[1rem] sm:w-[1.2rem] transition-transform" />
      ) : (
        <MoonIcon className="absolute sm:h-[1.2rem] h-[1rem] w-[1rem] sm:w-[1.2rem] transition-transform" />
      )}
    </Button>
  );
}
