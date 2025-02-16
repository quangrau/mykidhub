"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { GuardianOption } from "@/lib/guardian/guardian.types";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

interface GuardianSelectProps {
  guardians: GuardianOption[];
  onChange: (value: string) => void;
}

export function GuardianSelect({ onChange, guardians }: GuardianSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  function handleSelect(currentValue: string) {
    setValue(currentValue === value ? "" : currentValue);

    // Find guardianId by name
    const guardian = guardians.find(
      (guardian) => guardian.name === currentValue
    );
    if (!guardian) {
      return;
    }

    onChange(guardian.id);
    setOpen(false);
  }

  function renderSelectedValue(value: string) {
    const guardian = guardians.find((guardian) => guardian.name === value);
    if (!guardian) {
      return null;
    }

    return `${guardian.name} (${guardian.email})`;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value ? renderSelectedValue(value) : "Select existing guardian"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[375px] p-0">
        <Command>
          <CommandInput placeholder="Enter existing guardian name" />
          <CommandList>
            <CommandEmpty>No guardian found.</CommandEmpty>
            <CommandGroup>
              {guardians.map((guardian) => (
                <CommandItem
                  key={guardian.id}
                  value={guardian.name}
                  onSelect={handleSelect}
                >
                  {guardian.name} ({guardian.email})
                  <Check
                    className={cn(
                      "ml-auto",
                      value === guardian.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
