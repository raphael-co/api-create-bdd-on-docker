# front-end

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# front-create-bdd-on-docker

# build image : 

    docker build -t front-create-bdd-on-docker .        

# mettre dans un container ke projet front et le faire tourner : 
    docker rm -f front-create-bdd-on-docker
    docker run --name front-create-bdd-on-docker -p 8080:8080 front-create-bdd-on-docker

# rm image front : 
    docker rmi front-create-bdd-on-docker
