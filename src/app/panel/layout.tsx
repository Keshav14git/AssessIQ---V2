import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SignedIn>
        <div className="min-h-screen">
          <Navbar />
          <RoleGuard>
            <main className="px-4 sm:px-6 lg:px-8">{children}</main>
          </RoleGuard>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}