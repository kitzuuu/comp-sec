# 🔐 Vulnerable vs. Secure Web App: OWASP Top 10 Demo

A digital-wallet web app (sign-up, login, deposits and withdrawals, transaction history, admin dashboard) built **twice**: once with six deliberate [OWASP Top 10 (2021)](https://owasp.org/Top10/) vulnerabilities, and once with each of them fixed. Developed for the *Computer Security* course (BSC2420) at Maastricht University.

| Branch | Contents |
|:--|:--|
| [`unsafe`](https://github.com/kitzuuu/comp-sec/tree/unsafe) | Intentionally vulnerable version |
| [`safe`](https://github.com/kitzuuu/comp-sec/tree/safe) (default) | Patched version that follows security best practices |

> [!WARNING]
> Built for education only. The `unsafe` branch contains real, exploitable flaws: run it locally and never deploy it.

## Tech stack

Next.js 15 (App Router + API routes) · React 19 · TypeScript · Prisma ORM · MySQL · Tailwind CSS · Radix UI

## Vulnerabilities demonstrated

| OWASP 2021 category | How it shows up in the `unsafe` branch |
|:--|:--|
| **A01** Broken Access Control | Any user can open `/admin-dashboard` just by typing the URL. |
| **A02** Cryptographic Failures | Passwords are "encrypted" with a Caesar cipher, so they are trivial to recover. |
| **A03** Injection | The login form is open to SQL injection, e.g. `' OR 1=1 --` as the username. |
| **A04** Insecure Design | "Forgot password" shows the original password without verifying the user's identity. |
| **A05** Security Misconfiguration | Login attempts are not logged, so brute-force attacks go unnoticed. |
| **A07** Identification & Authentication Failures | No password policy: `1234` is accepted. |

The `safe` branch fixes each one, for example with bcrypt password hashing, Prisma queries instead of raw SQL strings, and an admin-role check before the dashboard loads.

## Getting started

Requirements: Node.js 18+ and a local MySQL server.

```bash
git clone https://github.com/kitzuuu/comp-sec.git
cd comp-sec
git checkout unsafe        # or: git checkout safe
npm install
```

Create a MySQL database called `next_auth`, then add a `.env` file in the project root:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/next_auth"
```

Apply the migrations and start the dev server:

```bash
npx prisma migrate dev
npm run dev                # http://localhost:3000
```

## Team

Group 19: [Huci Petrut-Rares](https://github.com/rares-hcy) and [Toma Cristian Nitu](https://github.com/kitzuuu)

This project is for academic use only and must not be used for unauthorized security testing or any malicious activity.
