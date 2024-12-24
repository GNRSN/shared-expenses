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
  const { data: groups } = api.groups.getForCurrentUser.useQuery(undefined, {
    initialData,
  });

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
      {!groups.length ? (
        <p className="text-center text-xl">No groups for user</p>
      ) : (
        <div className="flex w-full flex-col gap-4">
          {groups.map((g) => {
            return (
              <div key={g.groupId}>
                <div className="font-bold">{g.group.title}</div>

                <div>
                  {g.group.userToGroup.map((utg) => {
                    const userIsOwner = utg.userId === g.group.owner;

                    return (
                      <div key={utg.userId}>
                        • {utg.user.name}
                        {utg.userId === g.group.owner && " (Owner)"}
                        <Button
                          disabled={userIsOwner}
                          variant="destructive"
                          onClick={() =>
                            removeUserFromGroup.mutate({
                              userId: utg.userId,
                              groupId: g.groupId,
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
                  <InviteMemberButton groupId={g.groupId} />

                  <Button
                    variant="destructive"
                    onClick={() => deleteGroup.mutate(g.groupId)}
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
