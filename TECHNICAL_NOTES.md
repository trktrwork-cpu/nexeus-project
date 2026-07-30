# Technical Notes

## Card Ordering Strategy

Cards use an integer position field.

When a card is moved, the backend updates its position and adjusts the remaining cards to maintain consistent ordering.

---

## Weekly Report Logic

Reports calculate:

- Total hours from worklogs
- Newly created tasks
- Completed tasks
- Overdue tasks
- Hours grouped by user
- Hours grouped by card

using the selected week.

---

## Productivity Improvement

Card Labels

Labels allow users to categorize cards and improve board organization.

---

## Known Limitations

- Single board owner
- No real-time collaboration
- No email notifications
- Reports are weekly only