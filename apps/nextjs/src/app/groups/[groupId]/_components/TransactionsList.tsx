"use client";

import { use } from "react";

import type { RouterOutputs } from "@@/api";
import { Card } from "@@/ui/card";

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
          <Card
            key={transaction.id}
            className="mt-2"
          >
            <div className="flex flex-row p-3">
              <div className="flex h-12 w-12 items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-gray-100"></div>
              </div>
              <div className="mx-1 flex flex-auto flex-col">
                <div className="flex flex-row gap-1">
                  <div>{transaction.title}</div>
                  <div className="ml-auto">[your diff]</div>
                </div>
                <div className="flex flex-row gap-1">
                  <div>[paid by]</div>
                  <div className="ml-auto">
                    of {transaction.amount} {transaction.currency}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
