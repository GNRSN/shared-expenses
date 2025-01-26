"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CrossCircledIcon,
  DotsHorizontalIcon,
  MinusCircledIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import type { RouterOutputs } from "@@/api";
import { Avatar, AvatarFallback, AvatarImage } from "@@/ui/avatar";
import { Badge } from "@@/ui/badge";
import { Button } from "@@/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@@/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";

import { api } from "~/trpc/react";
import { InviteMemberButton } from "./InviteMemberForm";

type GroupData = RouterOutputs["groups"]["getForCurrentUser"][number];

export function GroupCard({
  group,
  userId,
}: {
  group: GroupData["group"];
  userId: string;
}) {
  const utils = api.useUtils();
  const deleteGroup = api.groups.deleteGroup.useMutation();
  const removeUserFromGroup = api.groups.removeUserFromGroup.useMutation({
    onSuccess: async () => {
      await utils.groups.getForCurrentUser.invalidate();
    },
  });
  const makeMemberOwner = api.groups.makeMemberOwner.useMutation();

  const [confirmMakeMemberOwner, setConfirmMakeMemberOwner] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/groups/${group.id}`}>{group.title}</Link>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {group.userToGroup.map(({ user }) => {
          const userIsOwner = user.id === group.owner;

          return (
            <div
              key={user.id}
              className="flex flex-row items-center gap-2 pb-2"
            >
              <Avatar>
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name ?? undefined}
                />
                <AvatarFallback>{user.name?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
              {user.name}
              {user.id === group.owner && (
                <Badge variant="outline">Owner</Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                  >
                    <DotsHorizontalIcon className="mr-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!userIsOwner && (
                    <DropdownMenuItem
                      onClick={() => {
                        makeMemberOwner.mutate({
                          userId: user.id,
                          groupId: group.id,
                        });
                      }}
                    >
                      <PlusCircledIcon className="mr-1" /> Make member owner
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    disabled={userIsOwner}
                    onClick={() =>
                      removeUserFromGroup.mutate({
                        userId: user.id,
                        groupId: group.id,
                      })
                    }
                  >
                    <MinusCircledIcon className="mr-1" /> Remove Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/*TODO: Confirm dialog needed so we make sure they are sure*/}
              {confirmMakeMemberOwner && (
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      makeMemberOwner.mutate({
                        userId: user.id,
                        groupId: group.id,
                      });
                      setConfirmMakeMemberOwner(false);
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmMakeMemberOwner(false)}
                  >
                    No
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>

      <CardFooter className="flex gap-2">
        <InviteMemberButton groupId={group.id} />
        {group.owner === userId && (
          <Button
            variant="destructive"
            onClick={() => deleteGroup.mutate({ groupId: group.id })}
          >
            <CrossCircledIcon className="mr-1" /> Delete group
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function GroupCardMinimal({ group }: { group: GroupData["group"] }) {
  return (
    <Link href={`/groups/${group.id}`}>
      <div className="flex flex-row items-center gap-2 rounded-lg p-3 transition hover:bg-muted">
        <CardTitle>{group.title}</CardTitle>
        <div className="ml-2 flex flex-row">
          {
            // REVIEW: Sorting?
            group.userToGroup.map(({ user }) => {
              return (
                <Avatar
                  key={user.id}
                  className="ml-[-0.5rem] h-6 w-6"
                >
                  <AvatarImage
                    src={user.image ?? undefined}
                    alt={user.name ?? undefined}
                  />
                  <AvatarFallback>{user.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
              );
            })
          }
        </div>
      </div>
    </Link>
  );
}
