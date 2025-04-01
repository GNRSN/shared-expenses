import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@@/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { cn } from "@@/ui/utils";

type ComboboxItem = {
  value: string;
  label: string;
};

type ComboboxProps = {
  value: string | null;
  onChange: (value: string) => void;
  items: ComboboxItem[];
  terminology: { itemName: string };
};

export function Combobox({
  value,
  onChange,
  items,
  terminology,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          // Specify flex because default is inline-flex
          className="flex w-[200px] justify-between"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : `Select ${terminology.itemName}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        // REVIEW: it was non trivial to get this to match trigger without fixed widths
        className="w-[200px] p-0"
      >
        <Command>
          <CommandInput placeholder={`Search ${terminology.itemName}...`} />
          <CommandList>
            <CommandEmpty>No {terminology.itemName} found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
