# VLSI Backend - NestJS API

## Overview

This is the backend API for the VLSI GVPCE(A) website, built with NestJS, Prisma ORM, and MySQL.

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: MySQL
- **Authentication**: JWT with Passport
- **Password Hashing**: bcryptjs
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js 18.17 or later
- MySQL database
- npm or yarn

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mysql://root:password@localhost:3306/vlsi_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_REFRESH_EXPIRES_IN="7d"

# App
PORT=3001
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:3000"

# File Upload
MAX_FILE_SIZE=10485760 # 10MB in bytes
```

## Database Setup

### Generate Prisma Client

```bash
npx prisma generate
```

### Create Database Migrations

```bash
npx prisma migrate dev --name init
```

### Push Schema to Database (Alternative)

```bash
npx prisma db push
```

## Development

Run the development server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`

## Build

```bash
npm run build
```

## Production

```bash
npm run start:prod
```

## Project Structure

```
vlsi-backend/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Root controller
│   ├── app.service.ts             # Root service
│   ├── prisma/
│   │   ├── prisma.service.ts      # Prisma service
│   │   └── prisma.module.ts       # Prisma module (Global)
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts        # Login, register, JWT logic
│   │   ├── auth.controller.ts     # Auth endpoints
│   │   ├── strategies/
│   │   │   ├── local.strategy.ts  # Email/password strategy
│   │   │   └── jwt.strategy.ts    # JWT token strategy
│   │   └── guards/
│   │       ├── local-auth.guard.ts
│   │       └── jwt-auth.guard.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts       # User CRUD operations
│   │   └── users.controller.ts
│   ├── club-members/
│   │   ├── club-members.module.ts
│   │   ├── club-members.service.ts
│   │   └── club-members.controller.ts
│   ├── core-members/
│   ├── projects/
│   ├── events/
│   ├── question-banks/
│   ├── textbooks/
│   ├── nptel-lectures/
│   ├── placement-prep/
│   ├── vlsi-materials/
│   ├── gate-pyqs/
│   ├── magazines/
│   ├── tests/
│   ├── notifications/
│   └── team-photos/
├── prisma/
│   └── schema.prisma              # Database schema
├── test/
├── .env
└── package.json
```

## API Endpoints

### Authentication

#### POST /auth/register
Register a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123",
  "year": "2024"
}
```

**Response:**
```json
{
  "id": "clx...",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

#### POST /auth/login
Login with credentials

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

#### GET /auth/profile
Get current user profile (Protected)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "clx...",
  "email": "user@example.com",
  "role": "USER"
}
```

### Users

- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Club Members

- `GET /club-members` - Get all club members
- `GET /club-members/:id` - Get club member by ID
- `POST /club-members` - Create club member (Admin)
- `PATCH /club-members/:id` - Update club member
- `DELETE /club-members/:id` - Delete club member

### Core Members

- `GET /core-members` - Get all core members
- `GET /core-members/:id` - Get core member by ID
- `POST /core-members` - Create core member (Admin)
- `PATCH /core-members/:id` - Update core member
- `DELETE /core-members/:id` - Delete core member

### Projects

- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `POST /projects` - Create project (Admin)
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Events

- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create event (Admin)
- `PATCH /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Educational Resources

Similar CRUD endpoints for:
- `/question-banks`
- `/textbooks`
- `/nptel-lectures`
- `/placement-prep`
- `/vlsi-materials`
- `/gate-pyqs`
- `/magazines`

### Tests

- `GET /tests` - Get all tests
- `GET /tests/:id` - Get test by ID
- `POST /tests` - Create test (Admin)
- `PATCH /tests/:id` - Update test
- `DELETE /tests/:id` - Delete test

### Notifications

- `GET /notifications` - Get all notifications
- `GET /notifications/active` - Get active notifications
- `POST /notifications` - Create notification (Admin)
- `PATCH /notifications/:id` - Update notification
- `DELETE /notifications/:id` - Delete notification

### Team Photos

- `GET /team-photos` - Get all team photos
- `GET /team-photos/:year` - Get team photo by year
- `POST /team-photos` - Upload team photo (Admin)
- `DELETE /team-photos/:id` - Delete team photo

## Database Models

### User Roles
- `USER` - Regular user
- `ADMIN` - Administrator
- `SUPERADMIN` - Super administrator

### Models (19 total)
1. User
2. Account (OAuth)
3. Session
4. clubMembers
5. coreMembers
6. Projects
7. ProjectImages
8. Event
9. EventFile
10. QuestionBank
11. TextBook
12. nptelLecture
13. placementPrep
14. vlsiMaterial
15. Test
16. magazine
17. gatePyqs
18. Notification
19. TeamPhoto

**Note**: Visitor model excluded per project requirements.

## Authentication Flow

1. User registers via `/auth/register`
2. Password is hashed using bcrypt
3. User logs in via `/auth/login`
4. Server validates credentials
5. JWT access token (15m) and refresh token (7d) generated
6. Client stores tokens
7. Client includes access token in Authorization header for protected routes
8. JWT Strategy validates token and extracts user info
9. On token expiry, use refresh endpoint to get new access token

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Linting

```bash
npm run lint
```

## Format Code

```bash
npm run format
```

## Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

## Next Steps

### Backend
1. ✅ Prisma schema migrated
2. ✅ Core modules generated (Auth, Users)
3. ✅ All resource modules scaffolded
4. ⏳ Implement service logic for each module
5. ⏳ Create DTOs with validation
6. ⏳ Add file upload service
7. ⏳ Implement role-based guards
8. ⏳ Add Swagger documentation
9. ⏳ Configure CORS for frontend
10. ⏳ Add error handling and logging

### Integration
1. Test auth endpoints with Postman
2. Create database migrations
3. Seed initial data
4. Connect frontend to backend
5. Test end-to-end flow

## Troubleshooting

### Prisma Client Not Found
```bash
npx prisma generate
```

### Database Connection Error
- Check DATABASE_URL in `.env`
- Verify MySQL is running
- Test connection: `mysql -u root -p`

### Port Already in Use
Change PORT in `.env` or:
```bash
lsof -i :3001
kill -9 <PID>
```

## License

Private - VLSID GVPCE(A)

## Contact

For issues and questions, contact the development team.
