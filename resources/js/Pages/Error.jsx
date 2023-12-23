import React from "react";
import { Link } from "@inertiajs/react";
export default function ErrorPage({ status }) {
    const title = {
        503: "503: Service Unavailable",
        500: "500: Server Error",
        404: "404: Page Not Found",
        403: "403: Forbidden",
    }[status];

    const description = {
        503: "Sorry, we are doing some maintenance. Please check back soon.",
        500: "Whoops, something went wrong on our servers.",
        404: "Sorry, the page you are looking for could not be found.",
        403: "Sorry, you are forbidden from accessing this page.",
    }[status];

    return (
            <div className="flex justify-center items-center h-screen bg-gray-950">
                <div id="error-page">
                    <h1 className="lg:text-6xl font-bold text-2xl text-white">
                        Oops!
                    </h1>
                    <p className="text-xl text-white">
                        {title}
                    </p>
                    <p className="text-3xl text-white">
                        {description}
                    </p>
                    <div className="mt-4">
                        <Link
                            href={route('dashboard')}
                            className="px-5 py-2 bg-white rounded-md hover:bg-gray-950"
                        >
                            Home
                        </Link>
                    </div>
                </div>
            </div>
    );
}
