"use client"

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface BannerProps {
    documentId: Id<"documents">;
}

export const Banner = ({
    documentId
} : BannerProps) => {
    const router = useRouter();

    const remove = useMutation(api.documents.remove);
    const restore = useMutation(api.documents.restore);

    const onRemove = () => {
        const promise = remove({ id: documentId })

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted!",
            error: "Failed to delete note.",
        });
        router.push("/documents");
    };
    const onRestore = () => {
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Resotring note...",
            success: "Note restored!",
            error: "Failed to restore note.",
        });
    };

    return (
       <div className="w-full bg-rose-600 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
            <p>
                This page is in the Trash.
            </p>
            <Button
                onClick={onRestore}
                variant="outline"
                size="sm"
                className="text-white bg-transparent hover:bg-primary/20 border-white hover:text-white p-1 px-2 h-auto font-normal"
            >
                Restore Page
            </Button>
            <ConfirmModal
                onConfirm={onRemove}
            >
                <Button
                    variant="outline"
                    size="sm"
                    className="text-white bg-transparent hover:bg-primary/20 border-white hover:text-white p-1 px-2 h-auto font-normal"
                    >
                    Delete Forever
                </Button>
            </ConfirmModal>
       </div>
    )
};