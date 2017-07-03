This node application is based on the swagger npm package - https://www.npmjs.com/package/swagger

After installing this package "swagger project create squares-api" created the squares-api directory with all files required to set up a set of api's to manage squares data.

API paramaters, validation, responses and schemas etc. are maintained in swagger.yaml and the JS code to persist data is maintained in the controllers. In this project the controllers put/get data using a mongo database. (using mongoose)

These api's are created/maintained using the following process;

1. from the squares-api directory run "swagger project start". This starts a node Express application serving http://localhost:10010. 

http://localhost:10010/swagger displays the yaml swagger definition for the apis
http://localhost:10010/squares/?size=10 etc will allow the api's to be tested

put, post etc can be tested using curl (e.g. curl --header "Content-Type: application/json" --request PUT --data '{"squareId":1,"userId":2,"xCoord":5}' http://localhost:10010/squares)

2. from the squares-api directory run "swagger project edit". This creates a webpage at a temporary URL  (e.g. http://127.0.0.1:58668/#!/) This webpage display a Swagger UI view of squares-api\api\swagger\swagger.yaml

3. API's are then maintained by changing the get, put etc. path definitions in swagger UI;

paths:
  /squares:
    get:
    post:

  /squares/{id}: 
    get:             
    put:
    delete: 

These definitions must have  x-swagger-router-controller and operationId defined. x-swagger-router-controller specifies the controller containing the operationId. The operationId specifies the JS function within the controller (getSquares() etc.)

4. Data access code is mainatained in the squares-api\api\controllers\squares.js. controller contains the following functions;

  getSquares()      
  getSingleSquare() 
  createSquare()    
  updateSquare()    
  deleteSquare()      
  
5. Testing can be performed using the following API calls;

http://localhost:10010/squares/?size=2
http://localhost:10010/squares/2

curl --header "Content-Type: application/json" --request POST --data '{"squareId":1,"userId":2,"xCoord":5,"yCoord":5,"desc":"description 1","shortDesc":"desc1","image":"XXXXX"}' http://localhost:10010/squares
curl --header "Content-Type: application/json" --request PUT  --data '{"squareId":1,"userId":2,"xCoord":5}' http://localhost:10010/squares   
curl --header "Content-Type: application/json" --request DELETE "http://localhost:10010/squares/1" 