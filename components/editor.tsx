"use client";

import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
    onChange?: (content: string) => void;
    initialContent?: string;
}

const Editor = ({
    onChange,
    initialContent
} : EditorProps) => {
    const { edgestore } = useEdgeStore();
    const { resolvedTheme } = useTheme();

    const handleUpload = async (file: File) => {
        const res = await edgestore.publicFiles.upload({
            file
        });
        return res.url;
    };

    const editor : BlockNoteEditor = useCreateBlockNote({
        initialContent: 
        initialContent 
        ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        uploadFile: handleUpload
    });
    
    const handleChange = () => {
        if(onChange && editor) {
            onChange(JSON.stringify(editor.document, null, 2));
        }
    };

    return (
        <BlockNoteView 
            editor={editor} 
            onChange={handleChange}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
        />
    )
}

export default Editor;