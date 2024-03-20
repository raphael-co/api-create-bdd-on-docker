# api-create-bdd-on-docker

# build image : 
    docker build -t api-create-bdd-on-docker .
# mettre dans un container les bdd et le projet back: 
    docker-compose up
# rm les bdd : 
    docker-compose down -v
# rm l'image api-create-bdd-on-docker : 
    docker rmi api-create-bdd-on-docker
# lancer le server en dev local sur son post :
    npm run dev 
# build le server :
    npm run build 

 
