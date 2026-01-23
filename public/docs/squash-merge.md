# Squash Merge & Release Cycle

This workflow is designed for sprint-based development with clean release cycles using squash merges.

## Sprint 1

### Feature Development

During Sprint 1, developers create feature branches from the `integration` branch and work independently:

- **feature/A**: 6 commits of focused work
- **feature/B**: 4 commits implementing specific functionality

Each feature goes through the standard PR process:
1. PR to `dev` for initial testing
2. PR to `stg` for QA validation
3. PR to `integration` once approved

### State at End of Sprint 1

- `integration` contains 10 commits (6 from Feature A + 4 from Feature B)
- `main` remains unchanged
- All features are tested and approved

## Release Day

### Step 1: Squash Merge to Main

The key to this workflow is the **squash merge** from `integration` to `main`:

```bash
# Create PR from integration to main
# Use "Squash and merge" option in GitHub
# Result: 10 commits become 1 clean commit on main
```

**Why squash?**
- Clean, linear history on main
- Easy to revert entire sprints if needed
- Clear release milestones
- Simplified auditing

### Step 2: Merge Main Back to Integration (CRITICAL)

This step is essential to avoid conflicts:

```bash
git checkout integration
git merge main
git push origin integration
```

**Result:**
- `main`: 1 squashed commit
- `integration`: 10 original commits + 1 merge commit from main
- **Content is identical in both branches** ✓

## Sprint 2

### Starting Fresh

With `integration` now synchronized with `main`, Sprint 2 begins without conflicts:

- **feature/C**: 3 new commits
- **feature/D**: 5 new commits

### No Conflicts

Because we merged `main` back to `integration`, all new feature branches start from a clean state:
- No merge conflicts
- No duplicate commits
- Clear history

### State at End of Sprint 2

- `integration`: 11 original commits + 1 merge from main + 8 new commits (3+5)
- `main`: Still at 1 squashed commit from Sprint 1

## Next Release

The cycle repeats:

1. Squash merge `integration` → `main` (1 new commit)
2. Merge `main` → `integration` (sync)
3. Continue to Sprint 3

## Benefits

✅ **Clean History**: Main branch has one commit per sprint  
✅ **Easy Reverts**: Roll back entire sprints with one revert  
✅ **No Conflicts**: Proper syncing prevents merge issues  
✅ **Clear Releases**: Easy to track what went out when  
✅ **Flexible**: Works with any number of features per sprint

## Best Practices

- Always merge main back to integration after release
- Keep sprint durations consistent
- Test thoroughly in integration before releasing
- Document release notes with each squash commit
- Tag releases in main for easy reference
