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
import { GroupCard } from "../_components/GroupCard";

export const runtime = "edge";

export default async function GroupIdPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const session = await auth();
  if (!session) return <div>You need to log in to display this page</div>;
  const { groupId } = await params;
  const group = await api.groups.getGroup({ groupId });

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
            <BreadcrumbLink asChild>
              <Link href="/groups">Groups</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{group?.title ?? "??"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-center justify-center gap-4">
        <Suspense
          key={groupId}
          fallback={
            <div className="flex w-full flex-col gap-4">Loading...</div>
          }
        >
          <div className="w-full max-w-2xl">
            {!group && (
              <div>Group does not exist or you do not have access to it</div>
            )}
            {!!group && (
              <GroupCard
                group={group}
                userId={session.user.id}
              />
            )}
          </div>
        </Suspense>
      </div>
    </main>
  );
}
