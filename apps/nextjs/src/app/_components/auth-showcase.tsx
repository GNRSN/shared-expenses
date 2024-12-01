import Link from "next/link";

import { auth, signIn, signOut } from "@acme/auth";
import { Button } from "@acme/ui/button";

export async function AuthShowcase() {
  const session = await auth();

  if (!session) {
    return (
      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signIn();
          }}
        >
          Sign in
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.name}</span>
      </p>

      <Link href="/groups">Groups</Link>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signOut();
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
