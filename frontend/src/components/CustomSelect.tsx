"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function CustomSelect({ options, value, onChange, placeholder, className = "" }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={selectRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-background border-4 border-border rounded-none focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold uppercase text-sm text-left shadow-[2px_2px_0px_var(--hard-shadow)]"
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder || "Select"}
                </span>
                <ChevronDown
                    size={20}
                    className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-background border-4 border-border shadow-[4px_4px_0px_var(--hard-shadow)] max-h-60 overflow-y-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left p-3 hover:bg-muted transition-colors font-bold uppercase text-sm border-b-2 border-border last:border-b-0 ${
                                value === option.value ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-foreground"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
