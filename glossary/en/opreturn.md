# OP_RETURN

**Category:** Technology

## Plain English

A special command in Bitcoin Script that lets you store small amounts of data permanently on the blockchain - data that can never be spent or modified.

## Analogy

Imagine a bulletin board in a town square. Anyone can pin a note to it, and once pinned, nobody can erase it. OP_RETURN is the Bitcoin equivalent, you can store a message, a hash, or data on the blockchain permanently.

## In Context

*"I used OP_RETURN to timestamp a document on the blockchain as proof it existed at a certain time."*

**What this means:** You create a transaction with an OP_RETURN output containing your data. The transaction goes on the blockchain forever. The data is immutable, nobody can change it or delete it, but it also can never be spent as Bitcoin.

## Why It Matters

OP_RETURN enables use cases like proof of ownership, timestamping, and data notarization. It allows you to permanently store data on Bitcoin without creating a separate blockchain.

## Related Terms

- Script
- Transaction
- Blockchain
- Inscription

---
