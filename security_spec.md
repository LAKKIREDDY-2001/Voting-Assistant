# Firestore Security Specification

## 1. Data Invariants
- A session must belong to a signed-in user (`userId`).
- Users can only read and write their own sessions.
- Messages must be nested under a session.
- Access to messages is inherited from the session's ownership (`userId`).
- Timestamps must be validated against `request.time`.

## 2. The Dirty Dozen Payloads (Rejection Targets)
1. Creating a session for a different `userId`.
2. Reading another user's session document.
3. Listing all sessions without a `userId` filter.
4. Updating a terminal session field (if any were defined, but here they are dynamic).
5. Injecting a 1MB string into the `lastMessage`.
6. Creating a message in a session the user doesn't own.
7. Spoofing `createdAt` with a past date from the client.
8. Deleting a session the user doesn't own.
9. Adding a "Ghost Field" (e.g., `isAdmin`) to a session.
10. Updating `userId` after creation (Immutability).
11. Bypassing `email_verified` check (if mandated).
12. Resource poisoning: Using a 2KB session ID.

## 3. Test Scenarios (firestore.rules.test.ts)
- `test('unauthenticated user cannot read sessions')`
- `test('user cannot create session for another user')`
- `test('user can read their own session')`
- `test('user can only update session with valid fields')`
