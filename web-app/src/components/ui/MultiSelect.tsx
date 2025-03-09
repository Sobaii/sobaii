import React, { HTMLAttributes } from "react";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/Popover";
import { DropdownArrowIcon } from "../../assets/icons";
import formatCamelCase from "../../util/formatCamelCase";

interface MultiSelectProps<T extends string>
  extends HTMLAttributes<HTMLDivElement> {
  selected: T[];
  setSelected: React.Dispatch<React.SetStateAction<T[]>>;
  darkMode?: boolean;
  queries: T[];
  placeholder?: string;
}

const MultiSelect = <T extends string>({
  selected,
  setSelected,
  darkMode = false,
  queries,
  placeholder = "Search",
  ...props
}: MultiSelectProps<T>) => {
  const handleOnClick = (query: T) => {
    if (selected.includes(query)) {
      setSelected(selected.filter((item) => item !== query));
    } else {
      setSelected([...selected, query]);
    }
  };

  const formattedButtonText = selected.length
    ? selected.map(formatCamelCase).join(", ")
    : placeholder;

  return (
    <Popover
      className={`flex flex-col gap-2.5 ${darkMode ? "dark" : ""}`}
      {...props}
    >
      <PopoverTrigger asChild>
        <Button variant="secondary">
          {formattedButtonText}
          <img src={DropdownArrowIcon} alt="Dropdown Arrow" className="ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <div className="flex flex-col gap-1 shadow-md bg-white border p-1 w-full rounded-lg">
          {queries
            .sort((a, b) => a.localeCompare(b))
            .map((query, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-1 px-2 rounded-md hover:bg-neutral-200 cursor-pointer"
                onClick={() => handleOnClick(query)}
              >
                <p
                  className={`font-semibold ${
                    selected.includes(query)
                      ? "text-green-600"
                      : "text-neutral-500"
                  }`}
                >
                  {formatCamelCase(query)}
                </p>
                {selected.includes(query) && (
                  <span className="text-green-600 text-sm">Selected</span>
                )}
              </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
