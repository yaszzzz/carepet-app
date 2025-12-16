"use client"

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button/Button';
import { P, Small } from '@/components/atoms/Typography';
import { X, Check } from 'lucide-react';

export interface ServiceCardProps {
  // Data props
  title: string;
  description: string;
  price: string;
  duration: string;
  category: 'grooming' | 'vet' | 'boarding' | 'training' | 'other';
  details?: string[];

  // UI props
  icon?: React.ReactNode;
  featured?: boolean;
  className?: string;

  // Action props
  onBook?: () => void;
  onLearnMore?: () => void;
  bookingHref?: string;
}

import Link from 'next/link';

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  ({
    title,
    description,
    price,
    duration,
    category,
    details,
    icon,
    featured = false,
    className,
    onBook,
    onLearnMore,
    bookingHref,
    ...props
  }, ref) => {
    const [showDetails, setShowDetails] = useState(false);

    // Category styling
    const categoryStyles = {
      grooming: {
        bg: 'bg-[#F0E491]/20',
        text: 'text-[#31694E]',
        border: 'border-[#F0E491]',
        badge: 'bg-[#F0E491] text-[#31694E]',
      },
      vet: {
        bg: 'bg-[#658C58]/20',
        text: 'text-[#658C58]',
        border: 'border-[#658C58]',
        badge: 'bg-[#658C58] text-white',
      },
      boarding: {
        bg: 'bg-[#BBC863]/20',
        text: 'text-[#31694E]',
        border: 'border-[#BBC863]',
        badge: 'bg-[#BBC863] text-[#31694E]',
      },
      training: {
        bg: 'bg-[#31694E]/10',
        text: 'text-[#31694E]',
        border: 'border-[#31694E]/30',
        badge: 'bg-[#31694E] text-white',
      },
      other: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        badge: 'bg-gray-600 text-white',
      },
    };

    const styles = categoryStyles[category];

    // Default icon based on category
    const defaultIcons = {
      grooming: '🛁',
      vet: '🏥',
      boarding: '🏠',
      training: '🎓',
      other: '⭐',
    };

    const displayIcon = icon || defaultIcons[category];

    const toggleDetails = () => {
      setShowDetails(!showDetails);
      if (!showDetails && onLearnMore) {
        onLearnMore();
      }
    }

    return (
      <Card
        ref={ref}
        className={cn(
          'h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden',
          featured && 'border-2 border-[#F0E491]',
          className
        )}
        hover
        shadow={featured ? 'lg' : 'md'}
        {...props}
      >
        {/* Card Header with Category Badge */}
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <div className={cn('p-3 rounded-xl', styles.bg)}>
              {typeof displayIcon === 'string' ? (
                <span className="text-2xl">{displayIcon}</span>
              ) : (
                <div className="text-2xl">{displayIcon}</div>
              )}
            </div>

            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold',
              styles.badge
            )}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>

          <CardTitle className={cn('text-xl', styles.text)}>
            {title}
          </CardTitle>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="space-y-4">
          <P className="text-sm text-gray-700 line-clamp-3">
            {description}
          </P>

          {/* Price & Duration */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div>
              <Small className="block text-gray-500 mt-1 text-xs">
                Mulai dari
              </Small>
              <span className="text-xl font-bold text-[#31694E]">
                {price}
              </span>
            </div>

            <div className="text-right">
              <Small className="text-gray-500">
                Estimasi waktu
              </Small>
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-small">{duration}</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Card Footer with Actions */}
        <CardFooter className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {bookingHref ? (
              <Link href={bookingHref} className="flex-1 w-full">
                <Button
                  className="w-full text-sm"
                  style={{ backgroundColor: '#658C58' }}
                >
                  Booking Sekarang
                </Button>
              </Link>
            ) : (
              <Button
                className="flex-1 text-sm"
                style={{ backgroundColor: '#658C58' }}
                onClick={onBook}
              >
                Booking Sekarang
              </Button>
            )}

            <Button
              variant="outline"
              className="flex-1 text-sm"
              style={{
                borderColor: '#BBC863',
                color: '#31694E',
              }}
              onClick={toggleDetails}
            >
              Detail
            </Button>
          </div>
        </CardFooter>

        {/* Sweep Up Detail Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-white z-10 transition-transform duration-500 ease-in-out flex flex-col",
            showDetails ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="p-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h4 className={cn("font-bold text-lg", styles.text)}>Detail Layanan</h4>
              <button
                onClick={toggleDetails}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <P className="text-sm text-gray-600 mb-4 italic">
              {description}
            </P>

            <div className="space-y-2">
              <h5 className="font-semibold text-sm text-gray-800">Apa yang termasuk?</h5>
              <ul className="space-y-2">
                {details?.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={16} className="text-[#658C58] mt-0.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
                {!details && <li className="text-sm text-gray-400">Tidak ada detail tambahan.</li>}
              </ul>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <Button
              className="w-full text-sm"
              style={{ backgroundColor: '#658C58' }}
              onClick={toggleDetails}
            >
              Tutup
            </Button>
          </div>
        </div>
      </Card>
    );
  }
);

ServiceCard.displayName = 'ServiceCard';

export { ServiceCard };