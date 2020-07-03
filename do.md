# Top

- [ ] Put today's tasks first in Review
- [ ] Edit task button
  - Including a "Done" button
  - Click in Plan view to open edit mode
- [ ] Add a never action
  - Deletes the task
- [ ] Switch to numeric IDs, sequential to the file

# More

- [x] Add a `by:today`, `by:thisweek`, `by:overdue`, `by:next30days` filters
- [x] Date filters could be "now", "all", or "now&undated"
  - Right now it's only 2 or 3, but arguably 1 is more useful
- [x] Lessen the highlight of `after` dates in the past
- [x] Ignore someday tasks
- [ ] Add a refresh button to refetch from git
- [x] Add a view / edit single task scene
  - Title, after, by, priroity, repeat, context, snooze
- [x] Hide empty sections when filtering
- [ ] Add created dates to all tasks
- [ ] Warn for `by` dates before `after` dates
- [ ] Decide if `by date` or `by:date` makes sense
- [x] Consider adding a unique (to the file) ID to each task

# Bugs

- [x] After dates do not match for "exact date"
- [x] Git revision does not land in UI on netlify
- [ ] Tasks with children get multiple finished dates
- [x] After 1 Jan, repeat after 2 months, doesn't repeat from today, but from the after date
- [ ] Impossible to search future dates (the show everything option disables all filters, and otherwise today's date is always applied)
- [x] Multiple finished dates anywhere kills adding, updating, etc
- [ ] If a single task throw during `repeat()`, this is silently ignored, effectively repeating tasks are therefore broken if they throw, and errors are silently swallowed
