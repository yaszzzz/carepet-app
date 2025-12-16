import Link from 'next/link';
import React from 'react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-neutral-950">
            <div className="space-y-6">
                {/* Illustration Placeholder - Using CSS shapes/Icon for now */}
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-indigo-500 dark:text-indigo-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                        404
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        Page Not Found
                    </h2>
                    <p className="mx-auto max-w-md text-gray-600 dark:text-gray-400">
                        Woof! We couldn't find the page you're looking for. It might have been moved or doesn't exist.
                    </p>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/dashboard"
                        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        href="/"
                        className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 dark:border-gray-800 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
                    >
                        Back Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
