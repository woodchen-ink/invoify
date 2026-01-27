import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
            <h1 className="text-6xl font-bold text-slate-800 dark:text-slate-200">
                404
            </h1>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                Page not found
            </p>
            <Link
                href="/"
                className="mt-8 rounded-lg bg-slate-800 px-6 py-3 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-800 dark:hover:bg-slate-300"
            >
                Go back home
            </Link>
        </div>
    );
}
