"use client";

import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateChatbotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const options = [
  {
    id: "website",
    label: "From Website",
    description: "Enter a URL and we'll build a prompt from your site.",
    icon: Globe,
    href: "/generate/website",
  },
  {
    id: "questions",
    label: "Answer Questions",
    description: "Answer a few questions and we'll craft the prompt.",
    icon: FileQuestion,
    href: "/generate/questionnaire",
  },
];

export function CreateChatbotModal({ open, onOpenChange }: CreateChatbotModalProps) {
  const [, setLocation] = useLocation();

  const handleSelect = (href: string) => {
    onOpenChange(false);
    setLocation(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md rounded-2xl border-gray-200 bg-white p-6 shadow-xl sm:p-8"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-1 text-center">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Create
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-sm font-medium text-gray-700">
          How would you like to create a chatbot?
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.href)}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6",
                  "transition-all hover:border-[#4698d8] hover:bg-blue-50/50 hover:shadow-md",
                  "focus:outline-none focus:ring-2 focus:ring-[#4698d8] focus:ring-offset-2"
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-[#4698d8]">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-center text-sm font-semibold text-[#4698d8]">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
