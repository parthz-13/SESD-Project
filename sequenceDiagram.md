# Sequence Diagrams — Smart Library & Resource Management System (SLRMS)

---

## 1. User Registration & Login

```mermaid
sequenceDiagram
    actor Client
    participant AuthController
    participant AuthService
    participant UserRepository
    participant DB as MySQL (Prisma)

    %% Registration
    Client->>AuthController: POST /api/auth/register { name, email, password, role }
    AuthController->>AuthService: register(data)
    AuthService->>UserRepository: findByEmail(email)
    UserRepository->>DB: SELECT user WHERE email = ?
    DB-->>UserRepository: null (not found)
    UserRepository-->>AuthService: null
    AuthService->>AuthService: hashPassword(password)
    AuthService->>UserRepository: create({ name, email, passwordHash, role })
    UserRepository->>DB: INSERT INTO users
    DB-->>UserRepository: User record
    UserRepository-->>AuthService: User
    AuthService->>AuthService: generateJWT(userId, role)
    AuthService-->>AuthController: { token, user }
    AuthController-->>Client: 201 Created { token, user }

    %% Login
    Client->>AuthController: POST /api/auth/login { email, password }
    AuthController->>AuthService: login(email, password)
    AuthService->>UserRepository: findByEmail(email)
    UserRepository->>DB: SELECT user WHERE email = ?
    DB-->>UserRepository: User record
    UserRepository-->>AuthService: User
    AuthService->>AuthService: comparePassword(plain, hash)
    AuthService->>AuthService: generateJWT(userId, role)
    AuthService-->>AuthController: { token, user }
    AuthController-->>Client: 200 OK { token, user }
```

---

## 2. Issue a Book (Librarian Issues Book to Member)

```mermaid
sequenceDiagram
    actor Librarian
    participant AuthMiddleware
    participant BorrowingController
    participant BorrowingService
    participant BookRepository
    participant BorrowingRepository
    participant NotificationService
    participant DB as MySQL (Prisma)

    Librarian->>AuthMiddleware: POST /api/borrowings/issue { memberId, bookId } + JWT
    AuthMiddleware->>AuthMiddleware: verifyToken(JWT)
    AuthMiddleware->>AuthMiddleware: authorize([LIBRARIAN, ADMIN])
    AuthMiddleware-->>BorrowingController: next()

    BorrowingController->>BorrowingService: issueBook(memberId, bookId, librarianId)

    BorrowingService->>BookRepository: findById(bookId)
    BookRepository->>DB: SELECT book WHERE id = ?
    DB-->>BookRepository: Book
    BookRepository-->>BorrowingService: Book

    BorrowingService->>BorrowingService: check availableCopies > 0

    BorrowingService->>BorrowingRepository: create({ memberId, bookId, issuedBy, issueDate, dueDate, status: ISSUED })
    BorrowingRepository->>DB: INSERT INTO borrowings
    DB-->>BorrowingRepository: Borrowing record
    BorrowingRepository-->>BorrowingService: Borrowing

    BorrowingService->>BookRepository: decrementCopies(bookId)
    BookRepository->>DB: UPDATE books SET availableCopies = availableCopies - 1
    DB-->>BookRepository: Updated Book

    BorrowingService->>NotificationService: sendDueReminder(memberId, bookTitle, dueDate)
    NotificationService->>DB: INSERT INTO notifications

    BorrowingService-->>BorrowingController: Borrowing
    BorrowingController-->>Librarian: 201 Created { borrowing }
```

---

## 3. Return a Book & Fine Calculation

```mermaid
sequenceDiagram
    actor Librarian
    participant BorrowingController
    participant BorrowingService
    participant BorrowingRepository
    participant BookRepository
    participant FineService
    participant FineRepository
    participant NotificationService
    participant DB as MySQL (Prisma)

    Librarian->>BorrowingController: PATCH /api/borrowings/:id/return + JWT
    BorrowingController->>BorrowingService: returnBook(borrowingId)

    BorrowingService->>BorrowingRepository: findById(borrowingId)
    BorrowingRepository->>DB: SELECT borrowing WHERE id = ?
    DB-->>BorrowingRepository: Borrowing
    BorrowingRepository-->>BorrowingService: Borrowing

    BorrowingService->>BorrowingService: check if returnDate > dueDate (overdue?)

    alt Book is overdue
        BorrowingService->>FineService: calculateFine(dueDate, today)
        FineService->>FineService: amount = daysDiff * fineRatePerDay
        FineService->>FineRepository: create({ borrowingId, memberId, amount, status: UNPAID })
        FineRepository->>DB: INSERT INTO fines
        DB-->>FineRepository: Fine record
        FineRepository-->>FineService: Fine
        FineService-->>BorrowingService: Fine
        BorrowingService->>NotificationService: sendOverdueAlert(memberId, bookTitle)
        NotificationService->>DB: INSERT INTO notifications
    end

    BorrowingService->>BorrowingRepository: update(id, { returnDate: today, status: RETURNED })
    BorrowingRepository->>DB: UPDATE borrowings
    DB-->>BorrowingRepository: Updated Borrowing

    BorrowingService->>BookRepository: incrementCopies(bookId)
    BookRepository->>DB: UPDATE books SET availableCopies = availableCopies + 1

    BorrowingService-->>BorrowingController: { borrowing, fine? }
    BorrowingController-->>Librarian: 200 OK { borrowing, fine }
```

---

## 4. Reserve a Book (Member)

```mermaid
sequenceDiagram
    actor Member
    participant AuthMiddleware
    participant ReservationController
    participant ReservationService
    participant BookRepository
    participant ReservationRepository
    participant NotificationService
    participant DB as MySQL (Prisma)

    Member->>AuthMiddleware: POST /api/reservations { bookId } + JWT
    AuthMiddleware->>AuthMiddleware: verifyToken(JWT)
    AuthMiddleware-->>ReservationController: next()

    ReservationController->>ReservationService: reserveBook(memberId, bookId)

    ReservationService->>BookRepository: findById(bookId)
    BookRepository->>DB: SELECT book WHERE id = ?
    DB-->>BookRepository: Book
    BookRepository-->>ReservationService: Book

    alt Book available (availableCopies > 0)
        ReservationService-->>ReservationController: 400 "Book is currently available, please borrow directly"
        ReservationController-->>Member: 400 Bad Request
    else Book not available
        ReservationService->>ReservationRepository: create({ memberId, bookId, reservedOn, expiryDate, status: PENDING })
        ReservationRepository->>DB: INSERT INTO reservations
        DB-->>ReservationRepository: Reservation record
        ReservationRepository-->>ReservationService: Reservation

        ReservationService->>NotificationService: sendAvailabilityAlert(memberId, bookTitle)
        NotificationService->>DB: INSERT INTO notifications

        ReservationService-->>ReservationController: Reservation
        ReservationController-->>Member: 201 Created { reservation }
    end
```

---

## 5. Pay a Fine (Member)

```mermaid
sequenceDiagram
    actor Member
    participant FineController
    participant FineService
    participant FineRepository
    participant DB as MySQL (Prisma)

    Member->>FineController: PATCH /api/fines/:id/pay + JWT
    FineController->>FineService: payFine(fineId)

    FineService->>FineRepository: findById(fineId)
    FineRepository->>DB: SELECT fine WHERE id = ?
    DB-->>FineRepository: Fine record
    FineRepository-->>FineService: Fine

    FineService->>FineService: check fine.status === UNPAID

    FineService->>FineRepository: markAsPaid(fineId)
    FineRepository->>DB: UPDATE fines SET status = PAID, paidOn = today
    DB-->>FineRepository: Updated Fine

    FineService-->>FineController: Fine
    FineController-->>Member: 200 OK { fine }
```
