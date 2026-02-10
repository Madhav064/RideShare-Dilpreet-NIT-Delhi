"use client";

import { Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Absolutely the best service in Delhi. The drivers are professional, the cars are spotless, and I always feel safe.",
    name: "Ariya Sharma",
    role: "Daily Commuter",
    rating: 5,
  },
  {
    id: 2,
    quote: "I love the premium feel of the app and the rides. It's so much better than the chaos of other apps. Highly recommended!",
    name: "Rohan Verma",
    role: "Business Traveler",
    rating: 5,
  },
  {
    id: 3,
    quote: "Clean cars and polite drivers. The black and white aesthetic is just the cherry on top. My go-to for airport transfers.",
    name: "Sneha Gupta",
    role: "Frequent Flyer",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <div className="w-full py-16 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Loved by thousands.
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            See what our riders are saying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((review) => (
            <Card
              key={review.id}
              className="p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-zinc-900 dark:fill-white text-zinc-900 dark:text-white"
                          : "text-zinc-300 dark:text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <blockquote className="text-zinc-600 dark:text-zinc-300 italic mb-6 leading-relaxed">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <AvatarFallback className="text-zinc-500 dark:text-zinc-400 font-medium">
                    {review.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-sm text-zinc-900 dark:text-white">
                    {review.name}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-500">
                    {review.role}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
