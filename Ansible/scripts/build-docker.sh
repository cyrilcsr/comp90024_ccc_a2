sudo rm -rf ccc-backend/backend/
cp -r comp90024_ccc_a2/backend/ ccc-backend/backend
cd ccc-backend/
docker build -f Dockerfile -t ccc_backend:1.10 .
docker rm backend
docker run -d -p 5000:5000 --name backend ccc_backend:1.10
docker exec -it backend /bin/bash
