import React from 'react';

export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-neutral-950">
            <div className="relative flex flex-col items-center">
                {/* Animated Paw Print or Circle */}
                <div className="h-16 w-16 animate-bounce rounded-full bg-indigo-600 shadow-lg flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-8 w-8 text-white"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 10.5H5.25m1.591-5.833l1.591 1.591"
                        />
                    </svg>
                </div>

                <div className="mt-8 flex flex-col items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        CarePet
                    </h2>
                    <div className="flex items-center space-x-1">
                        <div className="aspect-square w-2 animate-pulse rounded-full bg-indigo-500 delay-75"></div>
                        <div className="aspect-square w-2 animate-pulse rounded-full bg-indigo-500 delay-150"></div>
                        <div className="aspect-square w-2 animate-pulse rounded-full bg-indigo-500 delay-200"></div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Preparing the best for your pet...</p>
                </div>
            </div>
        </div>
    );
}
