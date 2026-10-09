"use client"

import { ReactNode, useMemo } from "react"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { ClerkProvider, useAuth } from "@clerk/clerk-react"

export const ConvexClientProvider = ({
    children
}: {
    children: ReactNode;
}) => {
    const convex = useMemo(() => {
        const url = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!url) return null;
        try {
            new URL(url);
        } catch {
            return null;
        }
        return new ConvexReactClient(url);
    }, []);

    if (!convex) {
        return (
            <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
               {children}
            </ClerkProvider>
        );
    }

    return (
        <ClerkProvider
            publishableKey={ process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY! }
        >
            <ConvexProviderWithClerk
                useAuth={useAuth}
                client={convex}     
            >
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}