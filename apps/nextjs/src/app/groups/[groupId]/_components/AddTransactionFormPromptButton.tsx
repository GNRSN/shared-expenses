"use client";

import { useState } from "react";

import { Button } from "@@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@@/ui/dialog";

import { AddTransactionForm } from "./AddTransactionForm";

// REVIEW: This is pretty stupid, 'use client' boundary forces us to separate this and
// the actual form in separate components since the form takes a callback, which can't be serialized
export function AddTransactionFormPromptButton({
  userId,
  groupId,
}: {
  userId: string;
  groupId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>

        <AddTransactionForm
          userId={userId}
          groupId={groupId}
          collapseForm={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
