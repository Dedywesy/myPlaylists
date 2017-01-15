Deployment instructions

Database : 
First, install PostgreSQL on your server and create your database. Then, run deploy_db.sql to create the tables : 
Username in the script stands for the database owner.

Server Deployment
At the root of the directory, run the following command : npm install .This will install all the needed packages for the server.
Then run this command : gulp . This compile all the angular files into one single one single javascript. 

Then, the following environment variable have to bet set : 
DATABASE_URL : postgres://user:password@dbServerAddress:port/dbName
CLOUD_SECRET : Your cloudinary secret key
JWT_SECRET : your secret for the json web token
SC_KEY : Your key for Soundcloud API
YT_KEY : Your key for Youtube API
PORT : The port you want your server to answer

In this file  /routes/models/images.js you also have to change cloud_name and api_key to match your cloudinary credentials.

Once everything is set right, you can launch the server with : npm start.