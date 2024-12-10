"use client";

import { useState } from "react";

// RHF
import { useFormContext, Controller } from "react-hook-form";

// ShadCn
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// Utils
import { cn } from "@/lib/utils";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Icons
import { CalendarIcon } from "lucide-react";

// Types
import { NameType } from "@/types";

type DatePickerFormFieldProps = {
    name: NameType;
    label?: string;
};

const DatePickerFormField = ({ name, label }: DatePickerFormFieldProps) => {
    const { control, setValue } = useFormContext();

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
        <div className="flex flex-col space-y-2">
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center  mb-1">
                            <FormLabel>{label}:</FormLabel>
                            <button
                                type="button"
                                className="text-sm text-blue-500 ml-2"
                                onClick={() => setValue(name, null)}
                            >
                                清除
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <Popover
                                open={isPopoverOpen}
                                onOpenChange={setIsPopoverOpen}
                            >
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[13rem]",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? (
                                                new Date(field.value).toLocaleDateString(
                                                    "en-US",
                                                    DATE_OPTIONS
                                                )
                                            ) : (
                                                <span>选择日期</span>
                                            )}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        captionLayout="dropdown-buttons"
                                        defaultMonth={field.value}
                                        selected={new Date(field.value)}
                                        onSelect={(e) => {
                                            field.onChange(e);
                                            setIsPopoverOpen(false);
                                        }}
                                        disabled={(date) =>
                                            date < new Date("1900-01-01")
                                        }
                                        fromYear={1960}
                                        toYear={
                                            new Date().getFullYear() + 30
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};

export default DatePickerFormField;
