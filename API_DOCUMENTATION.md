# LMS API Documentation

## Overview
Complete REST API for Library Management System built with Django REST Framework. All endpoints are authenticated using JWT tokens.

## Base URL
```
http://localhost:8000/api/
```

## Authentication Endpoints
### POST `/auth/register/`
Register a new user
- **Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "first_name": "John",
  "last_name": "Doe",
  "password": "password123",
  "password_confirm": "password123",
  "role": "librarian"
}
```
- **Response:** User object with status 201

### POST `/auth/login/`
Login and get JWT tokens
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response:** User object + access and refresh tokens

### POST `/auth/logout/`
Logout user (requires authentication)
- **Request Body:**
```json
{
  "refresh_token": "token_value"
}
```

### GET `/auth/profile/`
Get current user profile (requires authentication)

### POST `/auth/refresh/`
Refresh access token using refresh token

---

## Books Endpoints

### GET `/books/`
List all books (paginated)
- **Query Params:** `search=title_or_isbn`

### POST `/books/`
Create a new book
- **Required Fields:** title, isbn, author_id, category_id, quantity

### GET `/books/<id>/`
Get book details

### PUT `/books/<id>/`
Update book details

### DELETE `/books/<id>/`
Delete a book

### GET `/books/authors/`
List all authors

### POST `/books/authors/`
Create a new author

### GET `/books/authors/<id>/`
Get author details

### GET `/books/authors/<id>/books/`
Get all books by an author

### PUT `/books/authors/<id>/`
Update author details

### DELETE `/books/authors/<id>/`
Delete an author

### GET `/books/categories/`
List all categories

### POST `/books/categories/`
Create a new category

---

## Members Endpoints

### GET `/members/`
List all members

### POST `/members/`
Create a new member
- **Required Fields:** member_id, first_name, last_name, email, member_type

### GET `/members/<id>/`
Get member details

### PUT `/members/<id>/`
Update member details

### DELETE `/members/<id>/`
Delete a member

### POST `/members/<id>/block/`
Block a member from borrowing

### POST `/members/<id>/unblock/`
Unblock a member

### GET `/members/<id>/history/`
Get borrowing history of a member

---

## Transactions Endpoints

### GET `/transactions/`
List all transactions

### POST `/transactions/`
Issue a book to a member
- **Request Body:**
```json
{
  "member": 1,
  "book": 1
}
```

### GET `/transactions/<id>/`
Get transaction details

### POST `/transactions/<id>/return/`
Return a borrowed book

### GET `/transactions/reservations/`
List all reservations

### POST `/transactions/reservations/`
Create a book reservation
- **Request Body:**
```json
{
  "member": 1,
  "book": 1
}
```

### GET `/transactions/reservations/<id>/`
Get reservation details

### POST `/transactions/reservations/<id>/approve/`
Approve a reservation

### POST `/transactions/reservations/<id>/cancel/`
Cancel a reservation

---

## Fines Endpoints

### GET `/fines/`
List all fines

### GET `/fines/<id>/`
Get fine details

### POST `/fines/<id>/collect/`
Mark fine as paid

### POST `/fines/<id>/waive/`
Waive a fine

### GET `/fines/settings/`
Get fine settings

### PUT `/fines/settings/`
Update fine settings
- **Request Body:**
```json
{
  "fine_per_day": 15.00
}
```

---

## Notifications Endpoints

### GET `/notifications/`
List notifications
- **Query Params:** `member_id=<id>` (optional)

### POST `/notifications/<id>/read/`
Mark notification as read

### POST `/notifications/mark-all-read/`
Mark all notifications as read for a member
- **Request Body:**
```json
{
  "member_id": 1
}
```

---

## Dashboard & Reports Endpoints

### GET `/books/dashboard/stats/`
Get dashboard statistics
- Returns: total books, members, active transactions, overdue books, fines, weekly activity, monthly borrowing data

### GET `/books/reports/inventory/`
Generate inventory report
- Returns: total books, quantities, category breakdown, low stock items

### GET `/books/reports/circulation/`
Generate circulation report
- Returns: issued/returned books, most borrowed books, most active members

### GET `/books/reports/fines/`
Generate fines report
- Returns: unpaid fines, monthly collections, waived fines, members with outstanding fines

### GET `/books/reports/overdue/`
Generate overdue report
- Returns: list of overdue items with member and book details

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { /* error details */ }
}
```

---

## Authentication

All endpoints except `/auth/register/` and `/auth/login/` require JWT authentication.

**Header:**
```
Authorization: Bearer <access_token>
```

---

## Settings

- **DEFAULT_BORROWING_DAYS:** 14 days
- **DEFAULT_FINE_PER_DAY:** ৳10.00
- **RESERVATION_EXPIRY_DAYS:** 7 days
- **PAGE_SIZE:** 20 items per page

---

## Models

### User
- email, username, first_name, last_name, role (admin/librarian)

### Member
- member_id, first_name, last_name, email, phone, member_type (student/faculty/staff), is_blocked

### Book
- title, isbn, author, category, description, quantity, available_quantity, published_year

### Author
- first_name, last_name, nationality, genre, biography, birth_year

### Category
- name, description

### Transaction
- member, book, issued_by, issue_date, due_date, return_date, status (issued/returned/overdue), notes

### Reservation
- member, book, reserved_on, expires_on, status (pending/ready/expired/fulfilled/cancelled)

### Fine
- transaction, member, amount, status (unpaid/paid/waived), paid_at, waived_at

### Notification
- member, title, message, notification_type, is_read

---

## Technologies Used

- Django 4.2
- Django REST Framework 3.14
- Django Simple JWT 5.3
- Celery 5.3 (for async tasks)
- Redis (for caching and task queue)
- PostgreSQL (recommended for production)
- Channels 4.1 (for WebSocket support)

---

## Status Codes

- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid authentication
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
