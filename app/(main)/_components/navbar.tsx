"use client"

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MenuIcon } from "lucide-react";
import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;   
}

export const Navbar = ({
    isCollapsed,
    onResetWidth
} : NavbarProps) => {
    const params = useParams();
    const documents = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"documents">
    });

    if(documents === undefined) {
        return (
           <nav className="bg-background dark:bg-[#1F1F1F] flex items-center w-full px-3 py-2 justify-between">
                <Title.Skeleton/>
                <div className="flex items-center gap-x-2">
                    <Menu.Skeleton/>
                </div>
           </nav>
        )
    }

    if(documents === null) {
        return null;
    }

    return (
        <>
           <nav className="bg-background dark:bg-[#1F1F1F] flex items-center w-full px-3 py-2 gap-x-4">
            {isCollapsed && (
                <MenuIcon
                    role="button"
                    onClick={onResetWidth}
                    className="h-6 w-6 text-muted-foreground"
                />
            )}
            <div className="flex items-center justify-between w-full">
                <Title initialData={documents}/>
                <div className="flex items-center gap-x-2">
                    <Publish initialData={documents}/>
                    <Menu documentId={documents._id} />
                </div>
            </div>
           </nav>
            {documents.isArchived && (
                <Banner documentId={documents._id} />
            )} 
        </>
    )
}