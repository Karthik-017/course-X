sudo docker-compose up -d

sudo docker-compose down

sudo lsof -i :5432

sudo systemctl stop postgresql

npx prisma migrate dev --name init


todo:

section is still created even the order already exists
same with the content