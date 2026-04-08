## Architecture Notes

### 1. Modules

#### Auth

- Responsibility: registration, login, password hashing, JWT generation, JWT validation, and access control.
- Important rule: auth should not contain task or pomodoro business logic.
- It should only answer questions like:
  - who is the user?
  - is the user authenticated?
  - can this user access this resource?

#### Tasks

- Responsibility: create, update, delete, list, filter, and change task status.
- A task should belong to one user.
- Recommendation: for version 1, only authenticated users should create tasks.
- Reason: allowing "logged or not" users adds guest-mode complexity very early:
  - temporary storage
  - migration from guest to account
  - ownership conflicts
  - more edge cases in auth and persistence

#### Pomodoro Routines

- Responsibility: define reusable pomodoro templates.
- A routine should contain:
  - name
  - work duration
  - short rest duration
  - cycles before long rest
  - long rest duration
  - owner or global flag
- Important: this module defines the routine template, not the live timer execution.

#### Pomodoro Plans

- Responsibility: define how a task uses one routine.
- Example: task X uses the 25/5 routine for 4 cycles.
- This must stay separate from the reusable pomodoro routine.

#### Timer

- Responsibility: countdown, work/rest transitions, notifications, and active session state.
- Important: timer is not the same thing as a pomodoro routine.
- The routine defines the rules.
- The timer executes those rules.

#### Notes

- Responsibility: create and list notes attached to a task.
- Good extra feature: allow turning a note into a task later.
- Keep that as a separate use case, not as core note behavior.

### 2. Corrected Relationships

#### Core relationships

- User 1:N Task
- User 1:N PomodoroRoutine
- Task 1:N Note
- Task 1:0..1 PomodoroPlan
- PomodoroPlan N:1 PomodoroRoutine

#### Important corrections

- A task should not have a direct 1:1 relationship with Pomodoro.
- It should have a relationship with PomodoroPlan.
- PomodoroPlan should reference one PomodoroRoutine.
- This keeps template data separate from task-specific configuration.

#### Recommendation about optionality

- Do not require every task to have a pomodoro plan at creation time.
- Better rule: a task may exist without a plan, and later the user can attach one.
- So for the first version:
  - Task 1:0..1 PomodoroPlan

### 3. Global and User Routines

- Some pomodoro routines are global defaults.
- Some pomodoro routines are user-defined.
- Query rule:
  - return routines where `userId = null`
  - plus routines where `userId = currentUserId`

Modeling decision:

- keep the owner relation nullable

Reason:

- `userId = null` is simpler and avoids redundant state

Important architecture rule:

- normal users can manage only their own routines
- global routines should be read-only for normal users

Final rule:

- `userId = null` means global seeded routine
- `userId != null` means user-defined routine

### 4. Answer to Your Question About Pomodoro Data

Yes, your idea is correct.

A pomodoro routine should define things like:

- work time
- short rest time
- cycles before long rest
- long rest duration

That is exactly why PomodoroRoutine should be a reusable template.

What should NOT live in the routine:

- completed cycles for one task
- active countdown state
- task progress
- notification state

Those belong to:

- PomodoroPlan
- Timer
- and possibly a future Session entity if you want detailed history

### 5. Errors and Notifications

Your intuition is good, but split backend errors from frontend notifications.

#### Backend

- Return standardized error responses
- Use consistent categories such as:
  - validation error
  - authentication error
  - authorization error
  - not found
  - conflict
  - internal error

#### Frontend

- Translate those errors into user feedback
- Toasts are good for:
  - success messages
  - short non-blocking errors
  - retry feedback
- Inline messages are better for:
  - form validation
  - field-specific errors

Important rule:

- the backend should not know about toast notifications
- the frontend decides how to present the error

### 6. Main Feedback

What is already good:

- you already separated Pomodoro and PomodoroPlan as different concepts
- you already identified the core modules
- you are thinking about error handling early, which is correct

What should be fixed now:

- rename `Podoro` to `Pomodoro`
- do not let Auth control all business flow
- do not allow guest tasks unless you explicitly want a guest-mode feature
- do not model Task 1:1 Pomodoro directly
- do not force every task to have a plan from day one

### 7. Recommended Next Decision

Before writing code, define these rules clearly:

- Is task creation authenticated only? My recommendation: yes.
  Decision: for MVP, task creation will be only for authenticated users.

Architectural note:

- Guest mode is still a valid future feature.
- It should be deferred until the authenticated flow, task ownership, and persistence model are stable.
- Reason: guest mode adds extra complexity such as:
  - temporary persistence strategy
  - guest-to-user migration
  - ownership reassignment
  - sync edge cases

Post-MVP option:

- add guest mode as a separate increment once the base product is functional

- Is PomodoroPlan optional on task creation? My recommendation: yes.
  Decision: yes, PomodoroPlan is optional on task creation.

Reason:

- a task can exist as a normal todo without pomodoro configuration
- this keeps the task module independent from the timer workflow

- Will you track only plan progress, or also session history later?
  Decision: for the first product, track plan progress only.

Future option:

- session history can be added later for analytics, dashboards, and business-oriented reporting
- do not implement it now, but avoid designing the model in a way that blocks it later

- Will global routines be seeded by the system? My recommendation: yes.
  Decision: yes, global routines will be seeded by the system.

Modeling note:

- the owner relation will stay nullable
- global routines will be represented by `userId = null`

Tradeoff:

- nullable owner is simpler
- frontend clarity comes from documented query rules, not from redundant flags

Recommendation:

- for this project, the nullable owner relation is enough and keeps the model cleaner

Final rule:

- `userId = null` means global seeded routine
- `userId != null` means user-defined routine
