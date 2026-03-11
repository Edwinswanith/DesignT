#!/bin/bash
set -e

PROJECT_ID=legel-assistent-466812
REPOSITORY_NAME=designt
REGION=europe-west2
IMAGE_NAME=designt-frontend
IMAGE_TAG=v02
SERVICE_NAME=designt-ui

echo "Authenticating with Google Cloud..."
gcloud auth configure-docker $REGION-docker.pkg.dev --quiet

echo "Setting project to $PROJECT_ID"
gcloud config set project $PROJECT_ID

if ! gcloud artifacts repositories describe $REPOSITORY_NAME --location=$REGION &>/dev/null; then
  echo "Creating Artifact Registry repository $REPOSITORY_NAME..."
  gcloud artifacts repositories create $REPOSITORY_NAME --repository-format=docker --location=$REGION
fi

echo "Building image..."
docker build --no-cache -t $IMAGE_NAME:$IMAGE_TAG .

echo "Pushing to Artifact Registry..."
docker tag $IMAGE_NAME:$IMAGE_TAG $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY_NAME/$IMAGE_NAME:$IMAGE_TAG
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY_NAME/$IMAGE_NAME:$IMAGE_TAG

echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY_NAME/$IMAGE_NAME:$IMAGE_TAG \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --timeout=300s \
  --set-env-vars GEMINI_API_KEY=AIzaSyAtgwGJQUuMBTpW7razd29UlM9IO6MyqeQ
