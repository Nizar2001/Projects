# Loyalty Program Platform

A full-stack, role-based loyalty and event management platform that simulates a real-world rewards system used by modern businesses.

This application focuses on **secure backend logic**, **role-based authorization**, and **real operational workflows**, not just UI presentation.


## Quick Start (Recommended)

To explore all features without multiple logins, use the **Superuser account**.

**Login Credentials**
- Utorid: `super01`
- Password: `pass`

After logging in, you can switch between **Regular User, Cashier, Manager, and Superuser** roles directly from the interface.

> No setup or registration required — demo data is pre-seeded.


---

## What This Project Is

This project is a complete loyalty and rewards platform designed to model how production systems operate.

It enables an organization to:
- create customer accounts,
- reward customers with loyalty points,
- process purchases, redemptions, and transfers,
- run promotions and point-earning events,
- enforce strict role-based permissions,
- audit all activity through transactions and analytics.

All permissions, validations, and business rules are enforced **server-side**.

---

## Core System Concept

The platform is built around **points and transactions**.

- Regular users (customers) earn points through purchases, promotions, and events.
- Points can be redeemed for value or transferred to other users.
- Every action creates an immutable transaction record.
- Access to data and actions depends strictly on user role.

---

## Core Business Concepts

### Promotions

A **promotion** defines how users earn **extra points** during purchases.

Promotions can:
- run for a specific time window,
- require a minimum purchase amount,
- increase the point-earning rate,
- grant fixed bonus points,
- be automatic or manually applied at checkout.

Promotions affect how many points a user earns during a purchase transaction.

---

### Events

An **event** is a point-earning activity outside of purchases.

Events include:
- a name, location, and time window,
- optional capacity limits,
- a pool of points allocated to the event,
- assigned event organizers.

Users RSVP to events, attend them, and receive points once attendance is confirmed.  
Points awarded at events are tracked as event transactions.

---

## User Roles

### Regular User (Customer)
- View points balance
- Redeem points
- Transfer points to other users
- View transaction history
- Browse and RSVP to events
- View available promotions

Cannot access administrative or management pages.

---

### Cashier

Cashiers handle **day-to-day transactions** on behalf of customers.

They can:
- Create new regular user (customer) accounts
- Process purchase transactions
- Award loyalty points during checkout
- Apply eligible promotions to purchases
- Process point redemption requests
- View limited customer information required to complete transactions

Cashiers cannot modify system rules or access analytics.

---

### Manager

Managers have **all the capabilities of a Cashier**, plus **oversight and control responsibilities**.

They can do everything a Cashier can, **and additionally**:

**User & Role Management**
- View all users in the system
- Verify newly created user accounts
- Promote or demote users between Regular User and Cashier
- Flag or clear suspicious cashier activity

**Transaction Oversight**
- View and audit all transactions system-wide
- Mark transactions as suspicious or verified
- Create adjustment transactions to correct errors or misuse

**Events Management**
- Create, edit, publish, and delete events
- Set event capacity, schedules, and point allocations
- Assign and remove event organizers
- Monitor RSVPs and attendance
- Control how and when event points are distributed

**Promotions Management**
- Create, edit, and delete promotions
- Define promotion rules (time windows, rates, minimum spend, bonus points)
- Monitor promotion usage and validity

**Analytics & Monitoring**
- Access system-wide dashboards and statistics
- View metrics on points, events, promotions, and transactions

---

### Event Organizer

Event Organizers manage **specific events assigned to them**.

They can:
- Manage assigned events
- Confirm attendance
- Award points to event attendees
- Update event details within defined constraints

Organizers cannot self-award points or bypass event rules.

---

### Superuser (Admin) 

The **Superuser** is the highest-privilege role in the system and is responsible for **system-wide administration, oversight, and auditing**.

A Superuser has **all permissions of every other role** in the platform, including **Regular User, Cashier, Manager, and Event Organizer**, plus additional system-level control.

#### Superuser Responsibilities & Abilities

A Superuser can:

- Perform **all actions available to Managers, Cashiers, and Event Organizers**
- Promote or demote users to any role, including Manager
- Access **all dashboards, management pages, and analytics**
- Audit all users, transactions, promotions, and events
- Investigate suspicious activity and system inconsistencies
- Oversee overall system integrity and business rules

#### Role Switching

A Superuser can dynamically **switch between role views** without logging out and interact with the system as:

- Regular User
- Cashier
- Manager
- Superuser

This makes it possible to explore every workflow and permission boundary from a single account.

---

## Authentication & Login

The platform uses secure, account-based authentication with role-based authorization enforced by the backend.

## Tech Stack
- Frontend: React
- Backend: Node.js + Express
- Database: SQLite (Prisma ORM)
- Authentication: JWT-based role enforcement