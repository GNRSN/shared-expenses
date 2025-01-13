import { Suspense } from "react";
import Link from "next/link";
import { HomeIcon } from "@radix-ui/react-icons";

import { auth } from "@@/auth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@@/ui/breadcrumb";

import { api } from "~/trpc/server";
import { CreateGroupForm } from "./_components/CreateGroupForm";
import { GroupsList } from "./_components/GroupsList";

export const runtime = "edge";

export default async function GroupsPage() {
  const session = await auth();
  // LATER: Make this some cool reusable full page splash screen
  if (!session) return <div>You need to log in to display this page</div>;

  const groups = api.groups.getForCurrentUser();

  return (
    <main className="container h-screen py-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <HomeIcon />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <BreadcrumbLink asChild>
                <Link href="/groups">Groups</Link>
              </BreadcrumbLink>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col items-center justify-center gap-4">
        <CreateGroupForm />

        <div className="w-full max-w-2xl overflow-y-auto">
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">Loading...</div>
            }
          >
            <GroupsList groups={groups} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
