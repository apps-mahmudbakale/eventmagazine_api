<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Authentication Service API Documentation
### Overview
The Authentication Service provides secure user management with features such as:
+ User signup with OTP verification via email.
+ User login with email/password or OTP.
+ Location storage for users.
+ Admin login with role-based access.
+ Password reset functionality with OTP.
+ Secure password hashing using bcrypt.
+ JWT-based authentication.
+ Email delivery for OTPs using nodemailer.
## Endpoints
### User Signup
+ Endpoint: POST ``/auth/signup``
+ Description: Registers a new user and sends an OTP to their email for verification.
+ Request Body:
````bash
{
  "name": "string",
  "email": "string",
  "password": "string"
}
````
+ Response
````bash
{
  "id": number,
  "name": "string",
  "email": "string"
}
````
+ Errors:
    + ``409 Conflict`` : Email already exists.

### Resend OTP
+ Endpoint: POST ``/auth/resend-otp``
+ Description: Resends a new OTP to the user's email.
+ Request Body:
````bash 
{
  "email": "string"
}    
````
+ Response:
````bash
{
"message": "OTP resent successfully"
}
````
+ Errors:
    + ```404 Not Found```: User not found.

### Verify OTP

+ Endpoint: ````POST /auth/verify-otp````

+ Description: Verifies the OTP and returns a JWT token for the user.

+ Request Body:
````bash
{
"email": "string",
"otp": "string"
}
````
+ Response:
```bash
{
"token": "string"
}
```
+ Errors:
    + ```404 Not Found```: User not found.
    + ```400 Bad Request:``` Invalid or expired OTP.
### User Login
+ Endpoint: ````POST /auth/login````
+ Description: Authenticates a user with email and password, returning a JWT token.
+ Request Body:
````bash
{
"email": "string",
"password": "string"
}
````
+ Response:
````bash
{
"token": "string"
}
````
+ Errors:
    + ```401 Unauthorized```: Invalid email or password.
      Endpoints
1. Create a Magazine

   Method: POST

   Endpoint: /magazines

   Description: Creates a new magazine.

   Request Body:
   json

   {
   "name": "string",
   "category": "string",
   "type": "pdf | images | video",
   "status": "free | paid",
   "amount": number (optional, required if status is "paid")
   }

   Response:

        Status: 201 Created

        Body:
        json

        {
          "id": number,
          "name": "string",
          "category": "string",
          "type": "string",
          "status": "string",
          "amount": number | null
        }

   Example:
   bash

   curl -X POST http://localhost:3000/magazines \
   -H "Content-Type: application/json" \
   -d '{"name":"Tech Weekly","category":"Technology","type":"pdf","status":"paid","amount":9.99}'

2. Get All Magazines

   Method: GET

   Endpoint: /magazines

   Description: Retrieves a list of all magazines.

   Response:

        Status: 200 OK

        Body:
        json

        [
          {
            "id": number,
            "name": "string",
            "category": "string",
            "type": "string",
            "status": "string",
            "amount": number | null
          },
          ...
        ]

   Example:
   bash

   curl http://localhost:3000/magazines

3. Get a Magazine by ID

   Method: GET

   Endpoint: /magazines/:id

   Description: Retrieves a single magazine by its ID.

   Parameters:

        id: number (path parameter)

   Response:

        Status: 200 OK

        Body:
        json

        {
          "id": number,
          "name": "string",
          "category": "string",
          "type": "string",
          "status": "string",
          "amount": number | null
        }

        Error: 404 Not Found if magazine does not exist

   Example:
   bash

   curl http://localhost:3000/magazines/1

4. Update a Magazine

   Method: PUT

   Endpoint: /magazines/:id

   Description: Updates an existing magazine by its ID.

   Parameters:

        id: number (path parameter)

   Request Body:
   json

   {
   "name": "string",
   "category": "string",
   "type": "pdf | images | video",
   "status": "free | paid",
   "amount": number (optional, required if status is "paid")
   }

   Response:

        Status: 200 OK

        Body:
        json

        {
          "id": number,
          "name": "string",
          "category": "string",
          "type": "string",
          "status": "string",
          "amount": number | null
        }

        Error: 404 Not Found if magazine does not exist

   Example:
   bash

   curl -X PUT http://localhost:3000/magazines/1 \
   -H "Content-Type: application/json" \
   -d '{"name":"Tech Monthly","category":"Technology","type":"pdf","status":"free"}'

5. Delete a Magazine

   Method: DELETE

   Endpoint: /magazines/:id

   Description: Deletes a magazine by its ID.

   Parameters:

        id: number (path parameter)

   Response:

        Status: 200 OK

        Body: Empty

        Error: 404 Not Found if magazine does not exist

   Example:
   bash

   curl -X DELETE http://localhost:3000/magazines/1

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
