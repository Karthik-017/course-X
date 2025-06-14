sudo docker-compose up -d

sudo docker-compose down

sudo lsof -i :5432

sudo systemctl stop postgresql

npx prisma migrate dev --name init


todo:

should add setings component to user
files in which changes to be made: 
        schema.prisma
        routes/user.js (/me)
        settings component in frontend