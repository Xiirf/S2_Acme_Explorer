# S2_Acme_Explorer
## Postman test
Get environment from ./Postman/Environment/..
Get collection test from ./Postman/Collection
Para que funciona con https hay que hacer :
    File -> Settings -> SSL certificate verification: off

Puede encontrar pruebas para todos los modelos y una collection "Massive_Storage" para la carga massiva de datos.
Para cambiar el numero de item se puede cambiar para cada collection en ./data/generator.js

## Cube

http://localhost:8080/v1/docs/ 
Documentacion swagger con todos los modelos y el datawarehouse (con el cube)

## Commands
npm start 
npm run genData para la generacion de los datos para la carga massiva
Se puede cambiar el numero de datos aqui: ./data/generator.js
Hemos utilizados el insertMany porque con el otro los id de mongodb no funcionan
