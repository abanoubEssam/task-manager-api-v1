Green='\033[0;32m'
RED='\033[0;31m'
Yellow='\033[0;33m' # Yellow
NC='\033[0m' # No Color

echo " ${Green} Starting build development ${NC}"
docker-compose -f docker-compose.dev.yml down
echo " ${Yellow} Image Down ${NC}"

echo " ${RED} Removing The image ${NC}"
docker rmi task-manager-api-v1-app
echo " ${Yellow} Image Removed ${NC}"

echo " ${Green} Build new image ${NC}"
docker-compose -f docker-compose.dev.yml up -d --build && docker logs task-manager-api -f
