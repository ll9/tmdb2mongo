# TMDB2Mongo
This is a simple node application to get the basic movie information from the tmdb api. In order to run this tool you will have to provide your own API-Key from TMDB. The whole process should take about 36 hours (TMDB allows 40 transmission every 10 seconds). 
##### Instructions
1. `npm install`
2. start your mongodb (f.e. `mongod --dbpath path_to_data_folder`)
3. Enter your tmdb api-key in the config.json file
4. `npm start`
5. Wait about 36 hours.

###### Note
This app will try to reconnect on its own when the internet connection is lost. Currently it is important to let this app run the whole 36 hours until it's finished. If you have to interrupt this process you it's probably the best to drop your mongodb collection and restart from sratch. This might get improved in the future

