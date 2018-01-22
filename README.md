# Express Classrooms API

RESTful Express API for Classrooms on top of MongoDB.

## Authentication

Create a User with the following attributes:

| Attribute | Type   | Description   |
|-----------|--------|---------------|
| name      | string | Full name     |
| email     | string | Email address |
| password  | string | Password      |

Use the following endpoints to deal with initial authentication and the user.

| HTTP Verb | Path        | Description |
|-----------|-------------|--------------|
| `POST`    | `/users`    | Create a user account |
| `POST`    | `/sessions` | Log in with email and password, and retrieve a JWT token |
| `GET`     | `/users/me` | Retrieve own user data |

To authorize further requests, use Bearer authentication with the provided JWT token:

```
Authorization: Bearer <token here>
```

_**Note**: See `db/seed.js` for an example._

## Classrooms

**Note:** See `models/classroom.js` for the Classroom schema attributes.

| HTTP Verb | Path | Description |
|-----------|------|--------------|
| `GET` | `/classrooms` | Retrieve all classrooms |
| `POST` | `/classrooms` | Create a classroom* |
| `GET` | `/classrooms/:id` | Retrieve a single classroom by it's `id` |
| `PUT` | `/classrooms/:id` | Update a classroom with a specific `id`* |
| `PATCH` | `/classrooms/:id` | Patch (partial update) a classroom with a specific `id`* |
| `DELETE` | `/classrooms/:id` | Destroy a single classroom by it's `id`* |
| | | _* Needs authentication_ |

_**Note**: Run `yarn run seed` to seed some initial classrooms._
