#!/bin/bash
set -euo pipefail

# Configuration
IMAGE_REGISTRY="${IMAGE_REGISTRY:-quay.io}"
IMAGE_ORG="${IMAGE_ORG:-YOUR_ORG}"
IMAGE_NAME="moltbook-frontend"
IMAGE_TAG="${IMAGE_TAG:-latest}"
FULL_IMAGE="${IMAGE_REGISTRY}/${IMAGE_ORG}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "Building Moltbook frontend..."
echo "Image: ${FULL_IMAGE}"

# Build the Docker image
docker build -t "${FULL_IMAGE}" .

echo "✅ Build complete!"

# Push to registry
read -p "Push to registry? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Pushing ${FULL_IMAGE}..."
  docker push "${FULL_IMAGE}"
  echo "✅ Push complete!"

  echo ""
  echo "To deploy:"
  echo "  1. Update deploy/route.yaml with your cluster domain"
  echo "  2. Update deploy/kustomization.yaml with your image"
  echo "  3. Run: oc apply -k deploy/"
else
  echo "Skipping push."
fi
