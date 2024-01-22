"use client"

export const Navigation = () => {
    return (
        <>
        <aside className=" group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999] ">
            <div>
                <p>Action Items</p>
            </div>
            <div className="mt-4">
                <p>Documents</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100"/>
        </aside>
        </>
    );
}