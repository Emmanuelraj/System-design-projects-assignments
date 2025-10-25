# Chess Application Roadmap + Architecture

This diagram combines the **step-by-step roadmap** and **system architecture** for building a real-time chess application.

```mermaid
flowchart TD
    %% Roadmap Steps
    subgraph Roadmap [Roadmap Steps]
        A[Step 1: WebSocket Server]
        B[Step 2: Room-Based Architecture]
        C[Step 3: Redis Integration]
        D[Step 4: Basic ReactJS Frontend]
        E[Step 5: Monorepo Setup]
        F[Step 6: Chess Application Logic]
    end

    %% Outcome
    G[Outcome: Fully Functional Real-Time Chess App]

    %% Architecture Nodes
    subgraph Architecture [System Architecture]
        Client1[React Client 1]
        Client2[React Client 2]
        WS_Server[Node.js WebSocket Server]
        Redis[(Redis DB)]
    end

    %% Roadmap Flow
    A --> B --> C --> D --> E --> F --> G

    %% Architecture Flow
    Client1 -- WebSocket --> WS_Server
    Client2 -- WebSocket --> WS_Server
    WS_Server -- Save/Fetch State --> Redis
    WS_Server -- Pub/Sub --> Redis
    