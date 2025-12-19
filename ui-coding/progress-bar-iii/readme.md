Note: This is an advanced version of Progress Bars II, you should complete that question first before attempting this question.

In Progress Bars II, we built progress bars which fill up in sequence, one at a time. In this question, we'll build progress bars where multiple of them are filling up concurrently, up to a limit of 3. The fourth progress bar only starts filling up after the first one is full.

Requirements
Clicking on the "Add" button adds a progress bar to the page.
The progress bars fill up gradually in parallel, up to a limit of 3 concurrent bars filling up. i.e. the fourth progress bar will only start filling up after the first progress bar is completely filled up.
Each bar takes approximately 2000ms to completely fill up.
Hint: Realize that changing the concurrency limit to 1 reduces this question into the simpler Progress Bars II question. The solution to this question only requires a one-line change to the solution of Progress Bars II.