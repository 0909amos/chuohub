# ChuoHub

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- User authentication with role-based access (free vs premium users)
- Notes library: browse and view study notes by course/subject
- Past papers: access previous exam papers by year and subject
- Quizzes: multiple-choice quizzes with scoring and feedback
- Study planner: create and manage personal study tasks/schedules
- Community Q&A: post questions and answers, upvote helpful answers
- Premium content gating: mark certain notes/papers as premium-only
- Ad banner placeholders for free-tier users
- Offline-friendly architecture (lightweight, minimal data)
- Mobile-first responsive UI with simple bottom-navigation

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - User profiles with premium/free role
   - Notes CRUD (title, subject, content, isPremium, fileUrl)
   - Past papers CRUD (subject, year, isPremium, fileUrl)
   - Quizzes: questions with options and correct answers; quiz attempt recording
   - Study tasks: personal to-do items per user (title, dueDate, done)
   - Community Q&A: questions and answers with upvote counts

2. Frontend (React + Tailwind):
   - Mobile-first layout with bottom navigation bar
   - Screens: Home dashboard, Notes, Past Papers, Quizzes, Planner, Q&A, Profile
   - Premium badge and lock overlay for premium content
   - Ad banner component shown to free-tier users
   - Quiz flow with question cards and results screen
   - Study planner with checklist-style tasks
   - Q&A with question thread and answer list

3. Components:
   - authorization (user login + roles)
   - blob-storage (file uploads for notes/papers)
   - stripe (premium subscription payments)
