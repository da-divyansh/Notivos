"use client"

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";

interface DocumentIdPageProps {
    params: {
        documentId: Id<"documents">;
    }
}

const DocumentIdPage = ({
    params
} : DocumentIdPageProps) => {
    const documents = useQuery(api.documents.getById, {
        documentId: params.documentId
    });

    if (documents === undefined) {
        return <div>Loading...</div>;
    };
    if (documents === null) {
        return <div>Not Found</div>;
    };

    return (
        <div className="pb-40">
            <div className="h-[34h]"/>   
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
               <Toolbar initialData={documents} />
            </div>
        </div>
    );
};

export default DocumentIdPage;