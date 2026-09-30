# Troubleshooting GitHub Actions

## Why GitHub Actions Might Not Trigger

### 1. Check if Actions are Enabled

**Steps:**
1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Actions** → **General** (left sidebar)
4. Ensure "Allow all actions and reusable workflows" is selected
5. Ensure "Read and write permissions" is enabled under "Workflow permissions"

### 2. Verify Workflow Files Location

The workflow files MUST be in the `.github/workflows/` directory at the repository root.

**Correct structure:**
```
your-repo/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── docker-build.yml
│       ├── docker-build-local.yml
│       └── docker-publish-ghcr.yml
├── Dockerfile
├── index.html
├── script.js
└── styles.css
```

**Check your structure:**
```bash
ls -la .github/workflows/
```

### 3. Verify Branch Name

The workflows trigger on `main` or `master` branches. Check your current branch:

```bash
git branch
```

If your branch is named differently (e.g., `develop`, `trunk`), update the workflows:

```yaml
on:
  push:
    branches:
      - main        # Change this to your branch name
      - master
```

### 4. Check Commit and Push

Make sure you've committed AND pushed the workflow files:

```bash
# Check if files are staged
git status

# Add workflow files
git add .github/workflows/

# Commit
git commit -m "Add GitHub Actions workflows"

# Push to GitHub
git push origin main
```

### 5. Manually Trigger Workflow

All workflows have `workflow_dispatch` which allows manual triggering:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select a workflow from the left sidebar (e.g., "CI - Build and Test")
4. Click **Run workflow** button (top right)
5. Select branch
6. Click **Run workflow**

### 6. Check for YAML Syntax Errors

Validate your YAML files:

```bash
# Install yamllint (if not installed)
pip install yamllint

# Validate workflow files
yamllint .github/workflows/*.yml
```

Or use online validator: https://www.yamllint.com/

### 7. Check GitHub Actions Tab

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Look for:
   - **Workflows** (left sidebar) - Should show your 4 workflows
   - **All workflows** (center) - Should show workflow runs
   - Any error messages

### 8. Check Repository Permissions

If using organization repository:
1. Go to **Settings** → **Actions** → **General**
2. Check "Fork pull request workflows from outside collaborators"
3. Ensure organization allows Actions

### 9. Verify File Encoding

Ensure workflow files are UTF-8 encoded without BOM:

```bash
file .github/workflows/*.yml
```

Should show: `ASCII text` or `UTF-8 Unicode text`

### 10. Check for Hidden Characters

```bash
cat -A .github/workflows/ci.yml | head -20
```

Look for unexpected characters like `^M` (Windows line endings).

## Quick Test Workflow

Create a simple test workflow to verify Actions work:

**File: `.github/workflows/test.yml`**
```yaml
name: Test Workflow

on:
  push:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Print message
        run: echo "GitHub Actions is working!"
      
      - name: List files
        run: ls -la
```

Commit and push this file. If it runs, Actions are working!

## Common Issues and Solutions

### Issue: "No workflows found"
**Solution:** 
- Ensure `.github/workflows/` directory exists
- Ensure files have `.yml` or `.yaml` extension
- Push the files to GitHub

### Issue: "Workflow file is not valid"
**Solution:**
- Check YAML syntax (indentation must be spaces, not tabs)
- Validate with yamllint
- Check for special characters

### Issue: "Actions are disabled"
**Solution:**
- Go to Settings → Actions → Enable Actions

### Issue: "Workflow doesn't trigger on push"
**Solution:**
- Verify branch name matches workflow trigger
- Ensure you pushed to the correct branch
- Check if path filters are too restrictive

### Issue: "Permission denied"
**Solution:**
- Go to Settings → Actions → General
- Set "Workflow permissions" to "Read and write permissions"

## Debugging Steps

### Step 1: Create Simple Test Workflow
```bash
mkdir -p .github/workflows
cat > .github/workflows/test.yml << 'EOF'
name: Simple Test
on: [push, workflow_dispatch]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "It works!"
EOF

git add .github/workflows/test.yml
git commit -m "Test workflow"
git push
```

### Step 2: Check Actions Tab
Go to GitHub → Actions tab → Should see "Simple Test" workflow running

### Step 3: If Test Works
The issue is with the specific workflow files. Check:
- YAML syntax
- Docker-specific permissions
- Secrets configuration

### Step 4: If Test Doesn't Work
The issue is with GitHub Actions setup:
- Check repository settings
- Check organization settings (if applicable)
- Contact GitHub support

## Manual Verification Checklist

- [ ] GitHub Actions enabled in repository settings
- [ ] Workflow files in `.github/workflows/` directory
- [ ] Files have `.yml` extension
- [ ] YAML syntax is valid (no tabs, proper indentation)
- [ ] Branch name matches workflow trigger
- [ ] Files committed and pushed to GitHub
- [ ] No syntax errors in workflow files
- [ ] Workflow permissions set to "Read and write"
- [ ] Tried manual trigger via "Run workflow" button

## Get Workflow Status

Check if workflows are recognized:

```bash
# Using GitHub CLI (if installed)
gh workflow list

# View workflow runs
gh run list

# View specific workflow
gh run view
```

## Still Not Working?

1. **Delete and recreate workflows:**
   ```bash
   rm -rf .github/workflows/
   mkdir -p .github/workflows/
   # Copy workflow files again
   git add .github/workflows/
   git commit -m "Recreate workflows"
   git push
   ```

2. **Check GitHub Status:**
   Visit: https://www.githubstatus.com/

3. **Try in a new repository:**
   Create a test repository with just one simple workflow

4. **Contact GitHub Support:**
   If nothing works, there might be an account/organization restriction

## Expected Behavior

When workflows are working correctly:

1. **After push:**
   - Go to Actions tab
   - See workflow runs appear within seconds
   - Click on run to see details

2. **Workflow badges:**
   Add to README.md:
   ```markdown
   ![CI](https://github.com/USERNAME/REPO/workflows/CI%20-%20Build%20and%20Test/badge.svg)
   ```

3. **Email notifications:**
   You'll receive emails for failed workflows (if enabled)
