import Link from "next/link";

import { auth, signIn, signOut } from "@acme/auth";
import { Button } from "@acme/ui/button";

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="w-full bg-primary text-primary-foreground shadow-md">
      <nav className="items-left mx-auto flex p-6 shadow-lg md:justify-center lg:px-8">
        <div className="space-x-4 pr-4 md:flex lg:flex-1">
          <Link href="/">Home</Link>

          <Link href="/groups">Groups</Link>
        </div>

        {user ? (
          <div className="flex items-center">
            <p className="m-3 text-sm">Logged in as {user.name}</p>
            <form>
              <Button
                size="lg"
                formAction={async () => {
                  "use server";
                  await signOut();
                }}
              >
                Log out
              </Button>
            </form>
          </div>
        ) : (
          <form className="min-[320px]:px-4 sm:px-4 md:flex md:justify-end">
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
        )}
      </nav>
    </header>
  );
}
