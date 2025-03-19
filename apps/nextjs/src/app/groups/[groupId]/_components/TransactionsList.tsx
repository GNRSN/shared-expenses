"use client";

import { use } from "react";

import type { RouterOutputs } from "@@/api";

import { api } from "~/trpc/react";

export const TransactionsList = (props: {
  groupId: string;
  transactions: Promise<
    RouterOutputs["transactions"]["getTransactionsForGroup"]
  >;
}) => {
  const initialData = use(props.transactions);
  const { data: transactions } =
    api.transactions.getTransactionsForGroup.useQuery(
      { groupId: props.groupId },
      {
        initialData,
      },
    );

  return (
    <div>
      {transactions.map((transaction) => {
        return (
          <div key={transaction.id}>
            {transaction.amount}${transaction.description}
          </div>
        );
      })}
    </div>
  );
};
