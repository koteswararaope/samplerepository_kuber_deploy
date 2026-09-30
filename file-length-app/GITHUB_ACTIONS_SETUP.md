# GitHub Actions Setup Guide

This guide explains how to set up automatic Docker builds when you commit to GitHub.

## 📋 Overview

Four GitHub Actions workflows have been created:

1. **`ci.yml`** - Continuous Integration (build and test on every push)
2. **`docker-build.yml`** - Build and push to Docker Hub
3. **`docker-build-local.yml`** - Build only (no push) for feature branches
4. **`docker-publish-ghcr.yml`** - Publish to GitHub Container Registry (GHCR)

## 🚀 Quick Start

### Step 1: Push to GitHub

```bash
cd file-length-app
git init
git add .
git commit -m "Initial commit with GitHub Actions"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Set Up Secrets (for Docker Hub)

If you want to push to Docker Hub, add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:
   - `DOCKER_USERNAME` - Your Docker Hub username
   - `DOCKER_PASSWORD` - Your Docker Hub password or access token

### Step 3: Enable GitHub Actions

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Enable workflows if prompted

## 📦 Workflows Explained

### 1. CI - Build and Test (`ci.yml`)

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main` or `master`
- Manual trigger

**What it does:**
- Validates Dockerfile
- Validates docker-compose.yml
- Builds Docker image
- Runs container and tests it
- Checks if application responds to HTTP requests

**No secrets required** ✅

---

### 2. Docker Build and Push (`docker-build.yml`)

**Triggers:**
- Push to `main` or `master` branch
- Pull requests
- Manual trigger

**What it does:**
- Builds Docker image
- Pushes to Docker Hub (if not a PR)
- Tags with branch name, SHA, and `latest`

**Requires:**
- `DOCKER_USERNAME` secret
- `DOCKER_PASSWORD` secret

---

### 3. Docker Build Local (`docker-build-local.yml`)

**Triggers:**
- Push to `develop` or `feature/*` branches
- Manual trigger

**What it does:**
- Builds Docker image (doesn't push)
- Tests the image locally
- Validates container starts correctly

**No secrets required** ✅

---

### 4. Publish to GHCR (`docker-publish-ghcr.yml`)

**Triggers:**
- Push to `main` or `master` branch
- New tags (e.g., `v1.0.0`)
- Release published
- Manual trigger

**What it does:**
- Builds Docker image
- Pushes to GitHub Container Registry
- Automatically uses GitHub token (no setup needed!)

**No secrets required** ✅ (uses `GITHUB_TOKEN` automatically)

---

## 🎯 Recommended Workflow

### For Development
1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit
3. Push: `git push origin feature/my-feature`
4. **Workflow triggered:** `docker-build-local.yml` (builds and tests)

### For Production
1. Merge to `main` branch
2. **Workflows triggered:**
   - `ci.yml` (tests)
   - `docker-build.yml` (pushes to Docker Hub)
   - `docker-publish-ghcr.yml` (pushes to GHCR)

### For Releases
1. Create a tag: `git tag v1.0.0`
2. Push tag: `git push origin v1.0.0`
3. **Workflow triggered:** `docker-publish-ghcr.yml` with version tags

---

## 🐳 Using the Built Images

### From GitHub Container Registry (GHCR)

```bash
# Pull the image
docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO/file-length-checker:latest

# Run the container
docker run -d -p 8080:80 ghcr.io/YOUR_USERNAME/YOUR_REPO/file-length-checker:latest
```

### From Docker Hub

```bash
# Pull the image
docker pull YOUR_DOCKERHUB_USERNAME/file-length-checker:latest

# Run the container
docker run -d -p 8080:80 YOUR_DOCKERHUB_USERNAME/file-length-checker:latest
```

---

## 🔧 Manual Trigger

All workflows can be triggered manually:

1. Go to **Actions** tab in GitHub
2. Select the workflow
3. Click **Run workflow**
4. Choose the branch
5. Click **Run workflow**

---

## 📊 Viewing Build Status

### In GitHub
1. Go to **Actions** tab
2. Click on a workflow run
3. View logs and status

### Add Badge to README

Add this to your README.md:

```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI%20-%20Build%20and%20Test/badge.svg)
![Docker Build](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Docker%20Build%20and%20Push/badge.svg)
```

---

## 🔒 Security Best Practices

### For Docker Hub
- Use **Access Tokens** instead of passwords
- Create token at: https://hub.docker.com/settings/security
- Set token with **Read & Write** permissions

### For GHCR
- No setup needed! Uses `GITHUB_TOKEN` automatically
- Images are private by default
- Make public: Go to package settings → Change visibility

---

## 🐛 Troubleshooting

### Workflow not running?
- Check if workflows are enabled in repository settings
- Verify the file paths match your repository structure
- Check if the branch name matches the trigger conditions

### Build failing?
- Check the Actions logs for detailed error messages
- Verify Dockerfile is valid
- Ensure all required files exist

### Can't push to Docker Hub?
- Verify secrets are set correctly
- Check Docker Hub credentials
- Ensure token has write permissions

### Can't push to GHCR?
- Verify workflow has `packages: write` permission
- Check if GITHUB_TOKEN has necessary permissions
- Ensure repository allows package creation

---

## 📝 Customization

### Change trigger branches
Edit the `on.push.branches` section:
```yaml
on:
  push:
    branches:
      - main
      - production  # Add your branch
```

### Change image name
Edit the `env.IMAGE_NAME` section:
```yaml
env:
  IMAGE_NAME: my-custom-name
```

### Add more tests
Edit the test step in `ci.yml`:
```yaml
- name: Test application
  run: |
    curl -f http://localhost:8080 || exit 1
    # Add more tests here
```

---

## 🎉 Summary

Once set up, every commit to GitHub will:
1. ✅ Automatically build your Docker image
2. ✅ Run tests to ensure it works
3. ✅ Push to Docker Hub and/or GHCR (on main branch)
4. ✅ Tag with version numbers and commit SHAs

No manual Docker commands needed! 🚀
