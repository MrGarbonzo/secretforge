# GitHub Actions Workflows

## Build Backend Docker Image

The `build-backend.yml` workflow automatically builds and publishes the backend Docker image to GitHub Container Registry (ghcr.io).

### When does it run?

- **On version tags**: Push a tag like `v1.0.0` to trigger a versioned build
- **On main branch**: Automatically builds when pushing to main
- **Manual trigger**: Can be manually triggered from GitHub Actions tab

### How to trigger a release:

```bash
# Tag a new version
git tag v1.0.0
git push origin v1.0.0
```

This will build and publish:
- `ghcr.io/mrgarbonzo/secretforge/chat:v1.0.0`
- `ghcr.io/mrgarbonzo/secretforge/chat:1.0`
- `ghcr.io/mrgarbonzo/secretforge/chat:1`
- `ghcr.io/mrgarbonzo/secretforge/chat:latest`

### Make the image public:

After the first build, make the image public so SecretVM can pull it:

1. Go to https://github.com/MrGarbonzo?tab=packages
2. Find `secretforge/chat` package
3. Click on it → Package settings
4. Scroll down to "Danger Zone"
5. Click "Change visibility" → Select "Public"

This only needs to be done once!

### Image location:

The published image will be at:
```
ghcr.io/mrgarbonzo/secretforge/chat:latest
```

This is what the docker-compose template uses.

### Testing locally:

```bash
# Pull the image
docker pull ghcr.io/mrgarbonzo/secretforge/chat:latest

# Run it
docker run -p 3000:3000 -e SECRET_AI_API_KEY=your_key ghcr.io/mrgarbonzo/secretforge/chat:latest
```

### Troubleshooting:

**"Package not found"** - Make sure:
- The workflow has run successfully
- The package visibility is set to "Public"
- You're using the correct image path

**Build failures** - Check:
- GitHub Actions logs for errors
- backend/Dockerfile is valid
- All dependencies are in requirements.txt
