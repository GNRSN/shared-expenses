import { useState } from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

import { api } from "~/trpc/react";

export function InviteMemberButton({ groupId }: { groupId: string }) {
  const [userId, setUserId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const utils = api.useUtils();
  const addUserToGroup = api.groups.addUserToGroup.useMutation({
    onSuccess: async () => {
      setIsOpen(false);
      setUserId("");
      await utils.groups.getForCurrentUser.invalidate();
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircledIcon className="mr-1" /> Invite member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(userId);
            addUserToGroup.mutate({ userId, groupId });
          }}
        >
          <DialogHeader>
            <DialogTitle>Invite member</DialogTitle>
            <DialogDescription>
              For now, the user will just be added directly to the group
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Label htmlFor="userId" className="text-center">
              user id
            </Label>
            <Input
              id="userId"
              name="userId"
              placeholder="user id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
