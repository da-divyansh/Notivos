"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { cn } from "@/lib/utils";
import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
    } from "@/components/ui/dropdown-menu";

import { 
    ChevronDown, 
    ChevronRight, 
    LucideIcon, 
    MoreHorizontal, 
    Plus, 
    Trash2
 } from "lucide-react";
 import { useRouter } from "next/navigation";
 import React from "react";
 import { toast } from "sonner";
 import { useUser } from "@clerk/clerk-react";


interface ItemProps {
    id?: Id<"documents">;
    documentIcon?: string;
    active?: boolean,
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    label: string;
    onClick: () => void;
    icon: LucideIcon;
}

export const Item = ({
    id,
    label,
    active,
    onClick,
    onExpand,
    expanded,
    isSearch,
    level = 0,
    icon: Icon,
    documentIcon
}: ItemProps) => {
    const { user }= useUser();
    const router = useRouter();
    const create = useMutation(api.documents.create);
    const archive = useMutation(api.documents.archive);

    const onArchive = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        if(!id) return;
        const promise = archive({ id })
            .then(() => router.push("/documents"))

        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Moved to trash!",
            error: "Failed to delete."
        })
    }

    const handleExpand = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => { 
            event.stopPropagation();
            onExpand?.();
    }

    const onCreate = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        if(!id) return;
        const promise = create({title: "Untitled", parentDocument: id})
        .then((documentId) => {
            if (!expanded) {
                onExpand?.();
            }
            router.push(`/document/${documentId}`);
        });
        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create a new note."
        });
    };

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;

    return (
        <div 
          onClick={onClick}
          role="button"
          style={{
            paddingLeft: level ? `${(level * 12) + 12}px` : "12px"
        }}
          className={cn(
            "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
            active && "bg-primary/5 text-primary"
            )}
        >
            {!!id && (
                <div
                role="button"
                className="h-full roundded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
                onClick={handleExpand}
                >
                    <ChevronIcon className="shrink-0 h-[18px] text-muted-foreground/50"/>
                </div>
            )}
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">
                    {documentIcon}
                </div>
            ) : ( 
                <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground"/> 
            )}
            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd className=" ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px]font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">Ctrl +</span>K
                </kbd>
            )}
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu >
                        <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            asChild                        
                        >
                            <div 
                                role="button"
                                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground"/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={onArchive}>
                                <Trash2 className="h-4 w-4 mr-2"/>
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <div className="text-xs text-muted-foreground p-2">
                                Last edited by: {user?.fullName}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                        role="button"
                        onClick={onCreate}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                    >
                        <Plus className="h-4 w-4 text-muted-foreground"/>
                    </div>
                </div>
            )}
        </div>
    )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div 
            style={{
                paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
            }}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4 "/>
            <Skeleton className="h-4 w-[30%]"/>
        </div>
    )
}