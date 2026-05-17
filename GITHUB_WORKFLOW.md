# Intern GitHub Workflow Guidelines

## Purpose

This document defines the Git and GitHub workflow that every intern must follow while working on the project repository.

The goal is to:
- Keep the repository clean and organized
- Prevent accidental changes to production code
- Make collaboration easier
- Ensure proper review workflow
- Maintain code quality across teams

---

# Major Branch Structure

```txt
main
develop
feature/*
```

## Branch Purpose

| Branch | Purpose |
|---|---|
| `main` | Stable production-ready code |
| `develop` | Integration Branch | 
| `feature/*` | Individual intern work branches |

---

# Important Rules

## Interns MUST Follow

### ✅ Always

- Create a separate feature branch for every task
- Pull latest changes before starting work
- Push only to your own feature branch
- Create Pull Requests after task completion
- Use proper branch naming conventions
- Write meaningful commit messages
- Test your code before pushing

---

## ❌ Interns MUST NOT

### Never Push Directly to Main

```bash
git push origin main
```

### Never Work Directly On

```txt
main
dev
```

### Never

- Force push git push --force 
- Delete shared branches
- Push incomplete/broken code
- Rename shared branches
- Merge your own PR without approval
- Commit `.env` files or secrets
- Commit `node_modules`

---

# Branch Naming Convention

## Feature Branches

Format:

```txt
feature/featurename 
```

Examples:

```txt
feature/admin-dashboard-be
feature/admin-dashboard-fe
```

---

## Bug Fix Branches

Format:

```txt
bugfix/<issue>
```

Examples:

```txt
bugfix/navbar-overlap
bugfix/login-error
```

---

# Step-by-Step Workflow

# Step 1 — Open Project

Move into the project folder:

```bash
cd Pragati
```

---

# Step 2 — Pull Latest Changes

Interns:

```bash
git checkout develop
git pull origin develop
```

---

# Step 3 — Create Your Branch

Example:

```bash
git checkout -b feature/admin-dashboard-fe
```

This creates your personal working branch.

---

# Step 4 — Work On Your Task

Complete the assigned task.

Always test before committing.

---

# Step 5 — Add and Commit Changes

```bash
git add .
git commit -m "feat: added login page"
```

---

# Commit Message Convention

## Feature

```txt
feat: added authentication API
```

## Bug Fix

```txt
fix: resolved navbar issue
```

## Refactor

```txt
refactor: cleaned auth middleware
```

---

# Step 6 — Push Your Branch

```bash
git push origin feature/admin-dashboard-fe
if rebase -> git push --force origin feature/admin-dashboard-fe
```

---

# Step 7 — Create Pull Request

Create PR:

```txt
feature/admin-dashboard-fe → frontend-dev
```

---

# Pull Request Guidelines

## PR Title Format

```txt
[Frontend] Added Login UI
[Backend] Added JWT Authentication
[AI] Added prediction endpoint
```

---

## PR Description Should Include

- What was completed
- Screenshots (if UI changes)
- Issues faced
- Testing completed

---

# Code Review Process

After creating PR:

1. Team Lead reviews code
2. Changes may be requested
3. Fix requested issues
4. Push updated commits
5. Wait for approval

Do NOT merge PR yourself unless instructed.

---

# Updating Your Branch

Before starting your work everyday:

Note : Should be in your feature branch , check the current branch in IDE then procced to do the below command

```bash
git fetch origin
git rebase origin/develop

if any conflict , resolve using IDE , don't remove others code , include your code and other person's code , If you have doubt contact your captain through slack
once resolved

git add .
git rebase --continue

once rebase completed :

git push --force origin feature/admin-dashboard-fe

```
#if you don't commit any changes and need to sync use below commands:

```bash
git stash

git checkout develop

git pull origin develop

git checkout feature/admin-dashboard-fe

git merge develop

git stash pop

```

---

# Files You Should Never Commit

## Never Push

```txt
.env
node_modules/
dist/
build/
*.log
```

---

# Daily Workflow Checklist

## Before Starting Work

✅ Pull latest changes  
✅ Create/update your branch  
✅ Read task requirements  

---

## Before Pushing

✅ Test your code  
✅ Remove console logs  
✅ Check formatting  
✅ Ensure no secrets are committed  

---

## Before Creating PR

✅ Code works properly  
✅ Branch is updated  
✅ PR title is correct  
✅ Screenshots added if needed  


---

# Good Practices

## Recommended

- Commit frequently
- Push regularly
- Keep PRs small
- Ask doubts early
- Write readable code
- Follow folder structure
- Use reusable components/functions

---

# Common Mistakes To Avoid

## Avoid

❌ Working directly on shared branches  
❌ Large messy commits  
❌ Pushing broken code  
❌ Ignoring review comments  
❌ Copy-pasting code blindly  
❌ Uploading unnecessary files  
❌ Using unclear commit messages  

---

# Example Full Workflow

```txt
develop
    ↓
feature/admin-dashboard-be
    ↓
Work Completed
    ↓
git add .
    ↓
git commit
    ↓
git push
    ↓
Pull Request
    ↓
TL Review
    ↓
Merge into backend-dev
```

---

# Final Notes

Following this workflow helps:

- Maintain clean project history
- Reduce merge conflicts
- Improve code quality
- Make collaboration easier
- Prevent accidental production issues
- Keep the repository organized

Every intern is expected to follow these guidelines throughout the internship.
