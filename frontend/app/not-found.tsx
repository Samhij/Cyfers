"use client";

export default function NotFound() {
    return (
        <div className="fixed inset-0 bg-[#0000aa] text-white font-mono p-10 select-none">
            <div className="max-w-3xl">
                <p className="bg-white text-[#0000aa] inline-block px-2 mb-8 uppercase">
                    Windows
                </p>
                <p className="mb-8 text-xl leading-relaxed">
                    A problem has been detected and the URL has been terminated
                    to prevent damage to your sanity.
                </p>
                <p className="mb-4">
                    The error appears to be caused by the following file:
                    PAGE_NOT_FOUND
                </p>
                <p className="mb-8 uppercase font-bold text-2xl tracking-widest">
                    ERROR_404_NOT_FOUND
                </p>
                <p className="mb-4">
                    * Check to make sure you typed the URL correctly.
                </p>
                <p className="mb-4">
                    * If this is a new link, check with the developer.
                </p>

                <p className="mt-10">
                    Press any key to return to the homepage
                    <span className="inline-block ml-1 animate-[blink_1s_steps(2)_infinite]">
                        _
                    </span>
                </p>
            </div>

            {/* Adding the blink keyframes directly */}
            <style jsx global>{`
                @keyframes blink {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
