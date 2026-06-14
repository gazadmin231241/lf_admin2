# TASK

Merge the following branches into the current branch:

{{BRANCHES}}

For each branch:

1. Run `git merge <branch> --no-edit`
2. If there are merge conflicts, resolve them intelligently by reading both sides and choosing the correct resolution
3. After resolving conflicts, run `pnpm check:fast` plus focused tests/typechecks for the merged workspaces
4. If tests fail, fix the issues before proceeding to the next branch

After all branches are merged, run `pnpm test` if the sandbox has the required
local services. If the root test run is blocked by missing Docker, Redis,
Postgres, or another external dependency, record that blocker and rely on the
focused checks that did run. Then make a single commit summarizing the merge.

# CLOSE ISSUES

For each branch that was merged, close its issue using the following command:

`gh issue close <ID> --comment "Completed by Sandcastle"`

Here are all the issues:

{{ISSUES}}

Once you've merged everything you can, output <promise>COMPLETE</promise>.
