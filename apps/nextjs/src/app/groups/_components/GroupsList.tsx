"use client";

import { use } from "react";

import type { RouterOutputs } from "@acme/api";
import { Button } from "@acme/ui/button";

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
    // onError: (err) => {
    //   toast.error(
    //     err.data?.code === "UNAUTHORIZED"
    //       ? "You must be logged in to post"
    //       : "Failed to create post",
    //   );
    // },
  });

  return (
    <>
      {!groupsForUser.length ? (
        <p className="text-center text-xl">No groups for user</p>
      ) : (
        <div className="flex w-full flex-col gap-4">
          {groupsForUser.map(({ group }) => {
            return (
              <div key={group.id}>
                <div className="font-bold">{group.title}</div>

                <div>
                  {group.userToGroup.map(({ user }) => {
                    const userIsOwner = user.id === group.owner;

                    return (
                      <div key={user.id}>
                        • {user.name}
                        {user.id === group.owner && " (Owner)"}
                        <Button
                          disabled={userIsOwner}
                          variant="destructive"
                          onClick={() =>
                            removeUserFromGroup.mutate({
                              userId: user.id,
                              groupId: group.id,
                            })
                          }
                        >
                          Remove member
                        </Button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-1">
                  <InviteMemberButton groupId={group.id} />

                  <Button
                    variant="destructive"
                    onClick={() => deleteGroup.mutate(group.id)}
                  >
                    Delete group
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
