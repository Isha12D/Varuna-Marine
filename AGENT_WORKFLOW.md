# AI Agent Workflow Log

## Agents Used
- GitHub Copilot — for generating boilerplate TypeScript/React code and Prisma queries.
- Claude Code — for refactoring backend services and improving error handling.
- Cursor Agent — for organizing tasks, generating component stubs, and creating seed data.

## Prompts & Outputs

**Example 1:**  
**Prompt:** "Generate a Prisma schema for Routes, Ships, Banking, and Pooling tables with proper relations."  
**Output:** Auto-generated schema with relations between `Ship` → `BankingRecord` and `Pool` → `PoolMember`.

**Example 2:**  
**Prompt:** "Create a React component for Banking tab with GET/POST requests to the API and state management."  
**Output:** Component with hooks, form handling, and response display.  
**Refinement:** Manually added input validation and formatted API error handling.

## Validation / Corrections
- Checked Prisma schema for relation integrity and foreign keys.  
- Tested frontend components by mocking API calls to ensure correct data flow.  
- Corrected Copilot-generated code where type safety or async error handling was missing.

## Observations
- **Time saved:** Copilot accelerated boilerplate creation, Claude Code helped refactor backend logic efficiently.  
- **Failures:** Occasionally suggested incorrect Prisma relation syntax or skipped error handling.  
- **Effective combination:** Used Copilot for initial code, Claude for refactoring, Cursor for task management and keeping track of endpoints.

## Best Practices Followed
- Kept core logic separate from framework-specific code (hexagonal architecture).  
- Used TypeScript strict mode to prevent type errors.  
- Verified all agent outputs through small unit tests before integration.  
