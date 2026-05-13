# Execute Implementation Phase

Execute Phase $ARGUMENTS from the RAISE Act implementation plan.

## Steps

1. **Read context** — Read `implementation-plan.md` in full to understand Phase $ARGUMENTS tasks, dependencies, and deliverables. Read the relevant sections of `raise-act-prd.md` that apply to this phase (search for the phase's subject area, e.g. routing, form state, validation).

2. **Query NYSDS MCP** — Before writing any component wrapper or using any DS component, call `mcp__nysds__get_component` and/or `mcp__nysds__validate_component_api` for each NYSDS component involved in this phase. Use `mcp__nysds__find_components` if you need to discover what's available. Never assume prop names or event names — verify them from the MCP server first.

3. **Plan parallel work** — Identify which tasks within Phase $ARGUMENTS are independent of each other. Group them into parallel batches and sequential dependencies.

4. **Execute** — Use parallel subagents (via the Agent tool) for independent task groups. Each subagent should receive:
   - The specific tasks it owns
   - Relevant PRD excerpts
   - NYSDS API facts gathered in step 2
   - File paths and conventions from `AGENTS.md`

   Sequential tasks run after their dependencies complete.

5. **Verify** — Run the verification step described in the phase's last task (typically a smoke-test or dev-server check). Fix any issues before proceeding.

6. **Mark done** — For each completed task, update `implementation-plan.md` by changing `- [ ]` to `- [x]`

## Constraints

- Follow all rules in `AGENTS.md` and `CLAUDE.md`.
- Do not skip the NYSDS MCP query step — prop/event names from training data are unreliable.
- Do not mark tasks done until the verification step passes.
- Commit only after all tasks in the phase are marked complete.
