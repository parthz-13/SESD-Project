# ER Diagram — Smart Library & Resource Management System (SLRMS)

```mermaid
erDiagram

    USER {
        int id PK
        string name
        string email
        string passwordHash
        enum role
        datetime createdAt
        datetime updatedAt
    }

    MEMBER {
        int id PK
        int userId FK
        string membershipNumber
        enum membershipType
        date membershipExpiry
        float outstandingFine
        datetime createdAt
    }

    LIBRARIAN {
        int id PK
        int userId FK
        string employeeCode
        datetime createdAt
    }

    BOOK {
        int id PK
        string title
        string isbn
        string publisher
        int year
        int totalCopies
        int availableCopies
        datetime createdAt
        datetime updatedAt
    }

    AUTHOR {
        int id PK
        string name
        string bio
    }

    CATEGORY {
        int id PK
        string name
        string description
    }

    BOOK_AUTHOR {
        int bookId FK
        int authorId FK
    }

    BOOK_CATEGORY {
        int bookId FK
        int categoryId FK
    }

    BORROWING {
        int id PK
        int memberId FK
        int bookId FK
        int issuedBy FK
        date issueDate
        date dueDate
        date returnDate
        enum status
        datetime createdAt
    }

    RESERVATION {
        int id PK
        int memberId FK
        int bookId FK
        date reservedOn
        date expiryDate
        enum status
        datetime createdAt
    }

    FINE {
        int id PK
        int borrowingId FK
        int memberId FK
        float amount
        enum status
        date paidOn
        datetime createdAt
    }

    NOTIFICATION {
        int id PK
        int userId FK
        string title
        string message
        enum type
        boolean isRead
        datetime createdAt
    }

    USER ||--o| MEMBER : "has"
    USER ||--o| LIBRARIAN : "has"
    MEMBER ||--o{ BORROWING : "borrows"
    MEMBER ||--o{ RESERVATION : "reserves"
    MEMBER ||--o{ FINE : "incurs"
    BOOK ||--o{ BORROWING : "borrowed via"
    BOOK ||--o{ RESERVATION : "reserved via"
    BORROWING ||--o| FINE : "generates"
    LIBRARIAN ||--o{ BORROWING : "issues"
    BOOK ||--o{ BOOK_AUTHOR : "written by"
    AUTHOR ||--o{ BOOK_AUTHOR : "writes"
    BOOK ||--o{ BOOK_CATEGORY : "belongs to"
    CATEGORY ||--o{ BOOK_CATEGORY : "categorizes"
    USER ||--o{ NOTIFICATION : "receives"
```

---

## Entity Descriptions

| Entity | Description |
|---|---|
| `USER` | Base entity for all system users. Role can be `ADMIN`, `LIBRARIAN`, or `MEMBER`. |
| `MEMBER` | A library member who can borrow/reserve books. Linked to USER. |
| `LIBRARIAN` | A staff member who manages borrowings and cataloguing. Linked to USER. |
| `BOOK` | Represents a book in the library with copy tracking. |
| `AUTHOR` | Author details, linked to books via BOOK_AUTHOR. |
| `CATEGORY` | Genre/subject classification for books. |
| `BOOK_AUTHOR` | Junction table — many-to-many between BOOK and AUTHOR. |
| `BOOK_CATEGORY` | Junction table — many-to-many between BOOK and CATEGORY. |
| `BORROWING` | Tracks issued books with status: `ISSUED`, `RETURNED`, `OVERDUE`. |
| `RESERVATION` | Tracks book reservations with status: `PENDING`, `FULFILLED`, `CANCELLED`, `EXPIRED`. |
| `FINE` | Auto-generated when a borrowing becomes overdue. Status: `UNPAID`, `PAID`. |
| `NOTIFICATION` | System notifications for due dates, availability, and overdue alerts. |
