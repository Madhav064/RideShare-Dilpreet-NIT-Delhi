"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
  driverImage?: string;
  onSubmit: (rating: number, tags: string[], tip: number) => void;
}

export function FeedbackModal({
  isOpen,
  onClose,
  driverName,
  driverImage,
  onSubmit,
}: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tipAmount, setTipAmount] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const feedbackTags = [
    "Clean Car",
    "Good Driving",
    "Polite",
    "Good Music",
  ];

  const tipOptions = [20, 50, 100];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    onSubmit(rating, selectedTags, tipAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Glassmorphism Overlay */}
      <div 
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Card Content */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl w-full max-w-md space-y-6 animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-4 -mt-10">
          <div className="p-1.5 bg-white dark:bg-zinc-900 rounded-full shadow-xl">
             <Avatar className="w-20 h-20 border-2 border-zinc-100 dark:border-zinc-800">
                <AvatarImage src={driverImage} alt={driverName} />
                <AvatarFallback className="text-xl font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    {driverName.charAt(0)}
                </AvatarFallback>
             </Avatar>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Rate your ride with {driverName}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              How was your trip?
            </p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none group transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors duration-200",
                  rating >= star
                    ? "text-black fill-black dark:text-white dark:fill-white"
                    : "text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-400 dark:group-hover:text-zinc-600"
                )}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>

        {/* Feedback Tags */}
        <div className="grid grid-cols-2 gap-3">
          {feedbackTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                  isSelected
                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md transform scale-[1.02]"
                    : "bg-zinc-50 text-zinc-600 border-zinc-100 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Tipping Row */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 text-center">
            Add a tip?
          </p>
          <div className="flex justify-center gap-3">
            {tipOptions.map((amount) => {
              const isSelected = tipAmount === amount;
              return (
                <button
                  key={amount}
                  onClick={() => setTipAmount(isSelected ? 0 : amount)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-semibold transition-all border",
                    isSelected
                      ? "border-black text-black bg-zinc-50 dark:border-white dark:text-white dark:bg-zinc-800 ring-1 ring-black dark:ring-white"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-300"
                  )}
                >
                  ₹{amount}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment Area */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
          className="w-full h-20 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 resize-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white/20 transition-all"
        />

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full h-12 bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black text-base font-semibold rounded-xl shadow-lg transition-all active:scale-[0.98]"
        >
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}
