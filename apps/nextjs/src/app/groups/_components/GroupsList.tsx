"use client";

import { use } from "react";
import {
  CrossCircledIcon,
  DotsHorizontalIcon,
  MinusCircledIcon,
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

export function GroupsList(props: {
  groups: Promise<RouterOutputs["groups"]["getForCurrentUser"]>;
}) {
  const initialData = use(props.groups);
  const { data: groupsForUser } = api.groups.getForCurrentUser.useQuery(
    undefined,
    {
      initialData,
    },
  );

  const utils = api.useUtils();
  const deleteGroup = api.groups.deleteGroup.useMutation();
  const removeUserFromGroup = api.groups.removeUserFromGroup.useMutation({
    onSuccess: async () => {
      await utils.groups.getForCurrentUser.invalidate();
    },
  });

  return (
    <>
      {!groupsForUser.length ? (
        <p className="text-center text-xl">No groups for user</p>
      ) : (
        <div className="flex w-full flex-col gap-4">
          {groupsForUser.map(({ group }) => {
            return (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle>{group.title}</CardTitle>
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
                          <AvatarFallback>
                            {user.name?.[0] ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        {user.name}
                        {user.id === group.owner && (
                          <Badge variant="outline">Owner</Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <DotsHorizontalIcon className="mr-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              disabled={userIsOwner}
                              onClick={() =>
                                removeUserFromGroup.mutate({
                                  userId: user.id,
                                  groupId: group.id,
                                })
                              }
                            >
                              <MinusCircledIcon className="mr-1" /> Remove
                              Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </CardContent>

                <CardFooter className="flex gap-2">
                  <InviteMemberButton groupId={group.id} />

                  <Button
                    variant="destructive"
                    onClick={() => deleteGroup.mutate(group.id)}
                  >
                    <CrossCircledIcon className="mr-1" /> Delete group
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
