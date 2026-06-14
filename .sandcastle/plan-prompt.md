# ISSUES

Here are the open issues in the repo that are eligible for Sandcastle work:

<issues-json>

!`GH_PROMPT_DISABLED=1 timeout 20s gh issue list --state open --label Sandcastle --limit 100 --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]} | select(([.labels[] | select(. == "module:risky" or . == "module:standard")] | length) == 1)]' || echo '[]'`

</issues-json>

The list above has already been filtered to issues ready for work. Every issue
has the `Sandcastle` label and exactly one module risk label:
`module:risky` or `module:standard`.

The following Sandcastle issues are intentionally excluded because their module
risk labels are missing or contradictory:

<invalid-module-risk-json>

!`GH_PROMPT_DISABLED=1 timeout 20s gh issue list --state open --label Sandcastle --limit 100 --json number,title,labels --jq '[.[] | {number, title, labels: [.labels[].name]} | select(([.labels[] | select(. == "module:risky" or . == "module:standard")] | length) != 1)]' || echo '[]'`

</invalid-module-risk-json>

# TASK

Analyze the open issues and build a dependency graph. For each issue, determine whether it **blocks** or **is blocked by** any other open issue.

An issue B is **blocked by** issue A if:

- B requires code or infrastructure that A introduces
- B and A modify overlapping files or modules, making concurrent work likely to produce merge conflicts
- B's requirements depend on a decision or API shape that A will establish

An issue is **unblocked** if it has zero blocking dependencies on other open issues.

For each unblocked issue, assign a branch name using the exact format `sandcastle/issue-{id}` (no slug or other suffix). This must be deterministic so that re-planning the same issue always produces the same branch name and accumulated progress is preserved.

Copy the issue's module risk label into the output as `moduleRisk`. The value
must be exactly `module:risky` or `module:standard`.

# OUTPUT

Output your plan as a JSON object wrapped in `<plan>` tags:

<plan>
{"issues": [{"id": "42", "title": "Fix auth bug", "branch": "sandcastle/issue-42", "moduleRisk": "module:risky"}]}
</plan>

Include only unblocked issues. If every issue is blocked, include the single highest-priority candidate (the one with the fewest or weakest dependencies).

Always emit the `<plan>` tags, even when there is nothing to do. If there are no issues to work on at all, output `<plan>{"issues": []}</plan>` so the run can exit cleanly.
