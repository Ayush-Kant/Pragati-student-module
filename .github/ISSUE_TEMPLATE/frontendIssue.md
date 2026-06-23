---
name: Frontend Task
about: Frontend implementation task for interns
title: "[FE] "
labels: 
     - frontend 
assignees: ''
---


## 📋 Task Overview
<!-- Brief description of what this frontend task involves -->

> 🔀 **Branch to create:** `feature/`
> 🌿 **Base branch:** `develop`
> 👤 **Assigned to:** @
> 👀 **Reviewer:** @
> 📅 **Deadline:**

---

## 📁 Files to Create

```yaml
frontend:
  src:
    features:
      :
        pages:
          - .jsx

        components:
          - .jsx
          - .jsx

        hooks:
          - use.js

        services:
          - service.js
```

---

## 🔌 APIs to Connect

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/v1/` | |
| `PUT` | `/api/v1/` | |

---

## 🔐 Auth Header — Add to Every API Call

```js
headers: { Authorization: `Bearer ${token}` }
// token comes from localStorage or your auth context
```

---

## 📤 GET /api/v1/ — Response You Will Receive

```json
{

}
```

---

## 📤 PUT /api/v1/ — Request Body to Send

```json
{

}
```

---

## ✅ Validation Rules — Use React Hook Form + Zod

| Field | Rule |
|-------|------|
|  | Required |
|  | Required, minimum  characters |
|  | Maximum  characters |

---

## 🖼️ UI Requirements

- **View Mode** → <!-- describe what to show -->
- **Edit Button** → toggles to edit mode on same page (no new page / no redirect)
- **Submit** → call PUT API → show success toast → switch back to view mode
- **Loading** → show skeleton loader while GET API is fetching
- **Error** → show error banner if any API call fails — never a blank screen

---

## 📦 Mock Data — Use This While Backend is Building

```js
const mockData = {

};
```

---

## 🖥️ Git Commands — Follow These Exactly

### Step 1 — First Time Setup
```bash
git clone https://github.com/krishnabackup/Pragati.git
cd Pragati
git checkout develop
git pull origin develop
git checkout -b feature/
```

### Step 2 — Daily Work
```bash
git add .
git commit -m "feat: describe what you built"
git push origin feature/
```

### Step 3 — Stay Updated Every Day
```bash
git fetch origin
git rebase origin/develop
```

### Step 4 — When Task is Complete
```bash
# 1. Go to: https://github.com/krishnabackup/Pragati
# 2. Click: Pull Requests → New Pull Request
# 3. FROM: feature/   →   TO: develop
# 4. Title: [FE]  - 
# 5. Tag reviewer
# 6. Do NOT merge yourself — wait for reviewer approval
```

---

## 🚫 Do NOT Touch These Files

- Any other page or component outside your feature folder
- Any backend file
- Any file not listed in the **Files to Create** section above

---

## ✅ Acceptance Criteria

- [ ] Page loads and displays all fields correctly
- [ ] Edit form opens with current data already pre-filled
- [ ] All Zod validations work and show proper error messages
- [ ] API call sends correct request body
- [ ] Success toast appears after save
- [ ] Changes reflected — verify by reloading the page
- [ ] Skeleton loader shown while API is fetching
- [ ] Error banner shown if API call fails — no blank screen
- [ ] Empty states handled — no crash when data is missing
- [ ] Token missing → redirects to `/login`
- [ ] `401` response from API → redirects to `/login`
- [ ] Responsive layout — no broken UI on any screen size
- [ ] No console errors in browser