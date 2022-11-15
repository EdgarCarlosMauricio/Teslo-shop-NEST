<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API

0. npm Version 18.12.1 (En versiones abajo del 16 da error por utilizar es2021) ts(es2022)
1. Clonar Proyecto
2. ```yarn install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno
5. Levantar la base de datos
```
docker-compose up -d
```

6. Levantar: ```yarn start:dev```
7. Ejecutar Seed para crear Productos e Imagenes de productos Fake
```
http://localhost:PORT/api/seed
```




# Instalaciones
## Auth
0. nest g res auth --no-spec
1. yarn add bcrypt
2. yarn add -D @types/bcrypt
3. yarn add md5
4. yarn add -D @types/bcrypt
5. yarn add @nestjs/passport @nestjs/jwt passport passport-jwt
6. yarn add -D @types/passport-jwt  @types/passport
7. nest g gu auth/guards/userRole --no-spec
8. yarn add @nestjs/swagger