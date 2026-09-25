# Replace-by-Fee

**Kain:** Technology

## Simple Tori

Na feature wey dey let you increase the fee for pending transaction if e dey take too long to confirm, by sending new transaction with the same input but higher fee. People dey write am as "RBF".

## E Be Like

Imagine say you dey sit for slow restaurant and the waiter never take your order. Instead make you dey wait, you fit tell dem: "Actually, I go pay double if you take my order for next five minutes." Replace-by-Fee dey work the same way, if your transaction dey stuck for mempool, you fit bump the fee to get confirmed faster.

## How E Dey Used

My transaction dey unconfirmed for one hour, so I use RBF increase the fee.

**Wetin dis mean:** Your original transaction include low fee. You fit create new transaction wey dey spend the same Bitcoin but send am somewhere else (or back to yourself) with much higher fee. The network go dey prioritise the new one because e dey pay more.

## Why E Matter

RBF dey give you flexibility. For busy period when fees spike unexpectedly, you no need to wait hours for slow transaction, you fit bump am and get confirmed quick. But some merchants dey disable RBF support because dem dey worry about payment reversals.

## Wordings Wey Relate

- Transaction Fee
- Mempool
- Confirmation
- CPFP
---
