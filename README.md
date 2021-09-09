Movies Database
Create a service that looks for a movie in Open Movie Database API and caches the result, as well as returns them.

- All API calls should be cached under redis for faster load after the first time.
- Images that is returned from the API should be fetched and stored in a S3 bucket, or your file store of choice.
- All data should be persisted into DB for faster search.

Data: The data is available at [OMDB](https://www.omdbapi.com)

- the solution focuses on back-end. 
- the MVC model is used for this project, since it is easy to implement and easy to understand 
  and easy to read therefore it yields a cleaner and organized code.also docker is used in this project
  because it makes the whole project free from the physical setup and it is only matter of installing docker 
  and running few lines of code.this ofcourse make the project quiet Production-ready and faster integration is the main result. 

- trade-offs :
    * at first given my situation and time limitations it was not possible to write unit tests
      but i'm familiar with nodejs and express testing libraries like mocha and chia and to be fair 
      this project as you mentioned is for testing the general skills of programming and i hope have successfully
      created a clean and good code.also i must say if i had 7 to 10 more days i would have :
        1- enhance the code structures like using custom made classes 
        2- make the code more separated in purpose of creating a more reliable,more distinct and more scalable code.
        3- obviously automated tests! we all are know a successful and fast software product is made out of very fast and focused and agile 
            process called DevOps(not the devops it self alone!).and a big part of this devops process is automated tests to insure the code is doing what it is expected in a minimal waste of time .
        4- and more learning .
      
- node js is used for the core of this project ... express for creating rest api . axios for fetching
    movie information . mongoDB as noSQL data base for saving the results of each movie search.
    and redis for caching the results for faster loads.mongoose for creating Models nodemon for development server
    . also @aws-sdk/client-s3 is used for saving the posters into a s3 bucket.
  
- there is an aditional part of this project . and its the users section . beside of the main cause which
    is to implement Movies Database the Users parts are for more user related peace of software .liek sessions and i there is a /signup and /login routes for manageing and creating new sessions.
    this part is more likely wanted for any good user related software and it could have had some jwt and oauth security protocols.
  
- the soulotion is pretty straight forward . there is a GET /movies/:movie route . user will search a movie name via this route and the name is sent a s req.params
    then first we look for the movie information inside of the redis cache via a peace of middleware called isCachedInRedis inside of the redisMiddleware.js file and 
    if redis had all of the needed information then it will return the information as a response via 200 ok status.
    and if there is no data found in the redis cache then the code will look after the needed information inside the MongoDB instance via the isCachedInMongo function saved inside of the mongoMiddleware.js file
    if the needed data has been found then it will return the data as a response and also it will put the data to the redis cache again .
    if the data were not in the mongo either then the process of searching the movie title inside of the movieController will began. 
    it will fetch the data if the movie exists inside of the OMDB movies DB and it will save the data inside of the mongodb and redis.
    also the poster of each movie will be saved inside of the uploads folder in main directory. the saved files will be saved inside of the s3 bucket and also the s3 object key will be saved inside of the MovieModel in mongo.
    it would be a good practice to delete the saved images after it was uploaded inside of the s3 bucket.but won't
  
- Scalability :
    i think this project is not the most scalable . but with only creating some new .js files inside of the models and routes and controllers we can easily sacle up the project .
    and with docker adding new parts and connecting this parts togather will be easy and fun. in most parts!
  
- Production-readiness :
    i must say this project does not have advanced logging mechanisims or monitoring systems . the error handling is good in most parts 
  
- Security :
    with ssl/tls encryption the exposed routes will be secured so this project needs it.
    in the users part, the password is not saved as plain text and it will get encrypted.
    jwt and oauth protocol must be added.
    the secrets and enviroment variables are not hardcoded inside of the node-app but its hardcoded inside of the docker-compse files.
  
- Application Test : 
    as i mentioned before this project does not have the automated unit tests but you can easily test the only route of this project via postman
  

- Route example :
  localhost:3000/api/v1/movies/dune
  

- installation :
    install the docker on your local machine.
    clone this git repository
    hit this command inside of the terminal :
       sudo docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build -V
    
  
- please sign up to the https://www.arvancloud.com/fa and then initiate your own s3 bucket .after that you must replace the
  S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY variables with your bucket credentials.