# TASK

Fix issue {{TASK_ID}}: {{ISSUE_TITLE}}

Pull in the issue using `gh issue view <ID>`. If it has a parent PRD, pull that in too.

Only work on the issue specified.

Work on branch {{BRANCH}}. Make commits and run tests.

# CONTEXT

Here are the last 10 commits:

<recent-commits>

!`git log -n 10 --format="%H%n%ad%n%B---" --date=short`

</recent-commits>

# EXPLORATION

Explore the repo and fill your context window with relevant information that will allow you to complete the task.

Pay extra attention to test files that touch the relevant parts of the code.

# REQUIRED SKILL: $tdd

Before implementation, read and follow the canonical TDD skill mounted through
the repo-local symlink:

!`printf '\n## %s\n\n' .sandcastle/skills/tdd/SKILL.md; cat .sandcastle/skills/tdd/SKILL.md; for file in .sandcastle/skills/tdd/*.md; do [ -f "$file" ] || continue; [ "${file##*/}" != "SKILL.md" ] || continue; printf '\n## %s\n\n' "$file"; cat "$file"; done`

Use vertical RED -> GREEN -> REFACTOR cycles:

1. Write one behavior test through a public interface.
2. Run it and confirm it fails for the expected reason.
3. Write the smallest implementation that passes that test.
4. Repeat for the next behavior.
5. Refactor only while GREEN.

Do not write all tests first. If TDD is not practical for a slice, explain why
in the commit notes and still add the narrowest useful regression coverage.

# EXECUTION

Use RGR to complete the task.

1. RED: write one test
2. GREEN: write the implementation to pass that test
3. REPEAT until done
4. REFACTOR the code

# FEEDBACK LOOPS

Before committing, run `pnpm check:fast` and the narrow tests/typechecks for the
workspace you changed. If the task touches a single package, prefer that
package's `tsc` and focused test files before any root-wide run.

Use `pnpm test` only when the sandbox has the required local services. If it
fails because Docker, Redis, Postgres, or another external service is missing,
record the environment blocker and keep the targeted checks as the delivery
signal.

# COMMIT

Make a git commit. The commit message must:

1. Start with `RALPH:` prefix
2. Include task completed + PRD reference
3. Key decisions made
4. Files changed
5. Blockers or notes for next iteration

Keep it concise.

# THE ISSUE

If the task is not complete, leave a comment on the issue with what was done.

Do not close the issue - this will be done later.

Once complete, output <promise>COMPLETE</promise>.

# FINAL RULES

ONLY WORK ON A SINGLE TASK.
