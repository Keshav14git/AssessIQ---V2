"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export default function SyncUser() {
    const { user, isLoaded } = useUser();
    const syncUser = useMutation(api.users.syncUser);

    useEffect(() => {
        if (!isLoaded || !user) return;

        const sync = async () => {
            try {
                await syncUser({
                    clerkId: user.id,
                    email: user.primaryEmailAddress?.emailAddress || "",
                    name: user.fullName || "Anonymous",
                    image: user.imageUrl,
                });
            } catch (error) {
                console.error("Error syncing user:", error);
            }
        };

        sync();
    }, [user, isLoaded, syncUser]);

    return null;
}
