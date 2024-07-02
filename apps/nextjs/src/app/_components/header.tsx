import Link from "next/link";

import { auth, signIn, signOut } from "@acme/auth";
import { Button } from "@acme/ui/button";

const sharedClasses = {
  navContainer:
    "mx-auto flex items-left md:justify-center p-6 lg:px-8  shadow-lg",
  linkContainer: "md:flex lg:flex-1 space-x-4 pr-4",
  button: "text-sm font-semibold leading-6",
  hiddenLgFlex: "min-[320px]:px-4 sm:px-4 md:flex md:justify-end",
  hiddenLgFlex1: "min-[320px]:px-4 sm:px-4 md:flex md:flex-1 md:justify-end",
};

export default async function Header() {
  const session = await auth();
  const user = session?.user;
  return (
    <header className="w-full bg-primary text-primary-foreground shadow-md">
      <nav className={sharedClasses.navContainer}>
        <div className={sharedClasses.linkContainer}>
          <Link href="/">Home</Link>
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
          <form className={sharedClasses.hiddenLgFlex1}>
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
