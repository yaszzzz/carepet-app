'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-neutral-950">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-neutral-900">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#658C58]/10 dark:bg-[#658C58]/20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-8 w-8 text-[#658C58]"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </div>

                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    Something went wrong!
                </h2>
                <p className="mb-6 max-w-sm text-gray-600 dark:text-gray-400">
                    We apologize for the inconvenience. An unexpected error has occurred.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        onClick={
                            // Attempt to recover by trying to re-render the segment
                            () => reset()
                        }
                        className="rounded-xl bg-[#658C58] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#658C58]/90 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#658C58]"
                    >
                        Try again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700"
                    >
                        Go Home
                    </button>
                </div>
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-6 text-left">
                        <p className="text-xs font-mono text-red-500 break-all bg-red-50 p-2 rounded border border-red-100 dark:bg-red-900/10 dark:border-red-900/20">
                            {error.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
