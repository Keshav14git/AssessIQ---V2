"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import RoleSelectionDialog from "./RoleSelectionDialog";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
    const { user: clerkUser } = useUser();
    const user = useQuery(api.users.getUserByClerkId, {
        clerkId: clerkUser?.id || "",
    });

    // If loading or no user yet, just show children (or loading spinner), 
    // but better to show children and pop modal when ready to avoid flash.
    // Actually if we block, we should maybe show nothing? 
    // But if we show nothing, we block the app if query fails.
    // Let's render children and overlay the modal.

    // Logic: 
    // If user is loaded AND roleSelected is false -> Show Modal.
    const showModal = user !== undefined && user !== null && user.roleSelected === false;
    // Note: user.roleSelected might be undefined if it's an old user? 
    // But schema has optional. If undefined, we might want to force selection too?
    // Let's assume initialized to false for new users. 
    // For old users without the field, it will be undefined. 
    // Let's force it if it is NOT true.

    const isOpen = user !== undefined && user !== null && (user.roleSelected !== true);

    return (
        <>
            {isOpen && <RoleSelectionDialog isOpen={true} />}
            {children}
        </>
    );
}
