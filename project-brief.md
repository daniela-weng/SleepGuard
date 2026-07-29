# Project Brief

## Product Goal
Design a wearable device that uses AI to monitor and communicate breathing and sleeping patterns for seniors with sleep apnea. The device should suggest lifestyle adjustments based on collected data.

## Target User
Seniors — many of whom are not receptive to wearables or technology in general.

## Core Problem
1. **Comfort & convenience** — device must be as unobtrusive as possible for users resistant to wearables
2. **Data collection** — find the least intrusive method of capturing breathing/sleep data
3. **Communication** — present insights in a simple, accessible way for seniors who aren't tech-savvy

## Why a Wearable
A worn form factor enables passive, continuous data capture without requiring the user to actively operate anything overnight — no app to open, no button to remember to press. For a target user who is often resistant to new technology, the device itself should ask as little of them as possible; almost all of the "work" happens in the companion app, after the fact.

## AI's Role
- Turn raw breathing/SpO₂ signal into an interpretable severity signal (AHI → Normal/Mild/Moderate/Severe)
- Detect and flag individual breathing-pause events overnight
- Translate the same underlying data two ways: plain language for the senior user, clinical shorthand for a physician (see the "Doctor's Notes" pattern in `design-system.md`)
- Surface lifestyle-adjustment suggestions based on observed patterns — not treatment, not diagnosis

## Product Boundaries
- This product **monitors and flags** breathing/sleep patterns — it does not diagnose sleep apnea or any other condition.
- Suggestions are **lifestyle-level** (e.g., "worth watching," "worth mentioning at your next visit") — never a prescribed treatment or medical instruction.
- It's designed to **complement, not replace, clinical care.** Escalation language always points the user toward their doctor rather than resolving the concern itself.
- Currently a design exploration only — see `prototype-notes.md` and `technical-setup.md` for what's real vs. mocked.
