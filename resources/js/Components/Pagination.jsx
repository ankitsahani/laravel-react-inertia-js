import React from "react";
import { Link } from "@inertiajs/react";
import nFormatter from "@/utils/helper";

export default function Pagination({ links }) {
    function getClassName(active) {
        if (active) {
            return "mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary bg-gray-950 text-white";
        } else {
            return "mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary";
        }
    }
    return (
        <div className="flex items-center justify-between">
            <div className="pt-6">
                Showing {nFormatter(links.from)} to {nFormatter(links.to)} of {nFormatter(links.total)} entries
            </div>
            <div className="flex items-center gap-2">
                {links.links.length > 3 && (
                    <div className="flex flex-wrap mt-8">
                        {links.links.map((link, index) =>
                            link.url === null ? (
                                <div
                                    className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-950 border rounded"
                                    key={index}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </div>
                            ) : (
                                <Link
                                    className={getClassName(link.active)}
                                    href={link.url}
                                    key={index}
                                >
                                    
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                  
                                </Link>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
