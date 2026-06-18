# Architecture

## System Overview

The Fullstack Calculator is a two-tier web application following a **client-server architecture**. The React frontend acts as a thin presentation layer that delegates all computation to the Go backend via REST API calls.

```mermaid
graph LR
    subgraph Client
        A["Browser"]
    end

    subgraph Frontend["Frontend (React + Vite)"]
        B["Calculator UI"]
        C["useCalculator Hook"]
        D["API Client"]
    end

    subgraph Backend["Backend (Go)"]
        E["CORS Middleware"]
        F["HTTP Handler"]
        G["Calculator Engine"]
    end

    A -->|"Interacts"| B
    B -->|"State"| C
    C -->|"fetch()"| D
    D -->|"POST /api/calculate"| E
    E --> F
    F -->|"Delegates"| G
    G -->|"Result / Error"| F
    F -->|"JSON Response"| D
    D -->|"Updates"| C
    C -->|"Re-render"| B
```

---

## Backend Architecture

The backend follows a **layered architecture** with strict separation of concerns. Each layer has a single responsibility and communicates only with adjacent layers.

```mermaid
graph TB
    subgraph "HTTP Layer"
        MW["middleware/cors.go<br/>CORS Headers"]
        H["handler/handler.go<br/>Request Parsing<br/>Response Formatting<br/>Validation"]
    end

    subgraph "Business Logic Layer"
        C["calculator/calculator.go<br/>Pure Arithmetic Functions<br/>Error Handling"]
    end

    subgraph "Entry Point"
        M["cmd/server/main.go<br/>Server Bootstrap<br/>Route Registration"]
    end

    M --> MW
    MW --> H
    H --> C
```

### Package Dependency Rules

```mermaid
graph LR
    main["cmd/server"] --> handler
    main --> middleware
    handler --> calculator
    middleware -.->|"no dependency"| calculator
    handler -.->|"no dependency"| middleware
```

- `calculator` has **zero imports** from other project packages — it is pure and self-contained
- `handler` imports `calculator` only — it never touches middleware
- `main` wires everything together

---

## Frontend Architecture

The frontend uses **unidirectional data flow** with a custom hook managing all state transitions.

```mermaid
graph TB
    subgraph "Components (Presentational)"
        App["App.tsx"]
        Calc["Calculator.tsx"]
        Disp["Display.tsx"]
        KP["Keypad.tsx"]
        Btn["Button.tsx"]
    end

    subgraph "Logic Layer"
        Hook["useCalculator.ts<br/>State Machine"]
        API["api/calculator.ts<br/>HTTP Client"]
    end

    subgraph "Backend"
        Server["Go API Server"]
    end

    App --> Calc
    Calc --> Disp
    Calc --> KP
    KP --> Btn
    Calc -->|"uses"| Hook
    Hook -->|"calls"| API
    API -->|"POST /api/calculate"| Server
    Server -->|"JSON"| API
    API -->|"result/error"| Hook
    Hook -->|"state updates"| Calc
```

### State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Initial

    Idle --> InputtingFirst: Digit Press
    InputtingFirst --> InputtingFirst: More Digits / Decimal

    InputtingFirst --> OperatorSelected: Operator Press
    OperatorSelected --> InputtingSecond: Digit Press
    InputtingSecond --> InputtingSecond: More Digits / Decimal

    InputtingSecond --> Computing: Equals Press
    Computing --> DisplayingResult: API Success
    Computing --> DisplayingError: API Error

    DisplayingResult --> InputtingFirst: Digit Press
    DisplayingResult --> OperatorSelected: Operator Press (chain)
    DisplayingError --> Idle: Clear

    InputtingFirst --> Computing: Sqrt / Percent (unary)

    Idle --> Idle: Clear
    InputtingFirst --> Idle: Clear
    OperatorSelected --> Idle: Clear
    InputtingSecond --> Idle: Clear
    DisplayingResult --> Idle: Clear
    DisplayingError --> Idle: Clear
```

---

## Request / Response Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Calculator UI
    participant Hook as useCalculator
    participant API as API Client
    participant Server as Go Backend
    participant Calc as Calculator Engine

    User->>UI: Presses "5 + 3 ="
    UI->>Hook: inputDigit("5")
    Hook-->>UI: display: "5"
    UI->>Hook: selectOperation("add")
    Hook-->>UI: display: "5", expression: "5 +"
    UI->>Hook: inputDigit("3")
    Hook-->>UI: display: "3"
    UI->>Hook: calculate()
    Hook->>API: calculate("add", 5, 3)
    API->>Server: POST /api/calculate {"operation":"add","a":5,"b":3}
    Server->>Calc: Add(5, 3)
    Calc-->>Server: 8, nil
    Server-->>API: 200 {"result": 8}
    API-->>Hook: { result: 8 }
    Hook-->>UI: display: "8", expression: "5 + 3 ="
    UI-->>User: Shows "8"
```

### Error Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Calculator UI
    participant Hook as useCalculator
    participant API as API Client
    participant Server as Go Backend
    participant Calc as Calculator Engine

    User->>UI: Presses "5 ÷ 0 ="
    UI->>Hook: calculate()
    Hook->>API: calculate("divide", 5, 0)
    API->>Server: POST /api/calculate {"operation":"divide","a":5,"b":0}
    Server->>Calc: Divide(5, 0)
    Calc-->>Server: 0, ErrDivisionByZero
    Server-->>API: 400 {"error": "division by zero"}
    API-->>Hook: throws Error("division by zero")
    Hook-->>UI: error: "division by zero"
    UI-->>User: Shows "Error: division by zero"
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Docker Compose"
        subgraph "frontend-container"
            Nginx["Nginx<br/>:3000"]
            Static["Built React App<br/>(static files)"]
        end

        subgraph "backend-container"
            GoAPI["Go API Server<br/>:8080"]
        end
    end

    Browser["Browser"] -->|":3000"| Nginx
    Nginx -->|"Static assets"| Static
    Nginx -->|"/api/* → :8080"| GoAPI

    style Browser fill:#333,stroke:#6c63ff,color:#fff
    style Nginx fill:#1a1a2e,stroke:#6c63ff,color:#fff
    style GoAPI fill:#1a1a2e,stroke:#51cf66,color:#fff
```

---

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Go HTTP framework | Standard library `net/http` | No external dependencies, sufficient for a REST API of this size |
| Frontend framework | React + TypeScript | Strong typing, component model, extensive ecosystem |
| Build tool | Vite | Fast HMR, native TypeScript support, simple proxy config |
| CSS approach | Vanilla CSS + custom properties | Full control, no build-time overhead, design tokens via variables |
| State management | Custom hook | No need for Redux/Zustand — state is localized to one component tree |
| API design | Single unified endpoint | Simpler contract, easier to validate, one handler function |
| Testing (Go) | Standard `testing` + `httptest` | No external test framework needed |
| Testing (React) | Vitest + Testing Library | Fast, Vite-native, encourages testing behavior over implementation |
| Deployment | Docker Compose | Simple multi-container orchestration, reproducible environments |
