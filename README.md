Acadia Energy Dashboard
=======================
Acadia University Energy Dashboard Application
Usage
=====
  - To run the NodeJS server manually use:<br/> 
      $ NODE_ENV=<i>development</i> PORT=<i>4000</i> /usr/local/bin/node <i>/usr/local/www</i>/serv.js <br/>
      <i>env</i>: development or production <br/>
      <i>port</i>: port choosen for the NODEJS server <br/>
      <i>dir</i>: the root directory of the server <br/>
    Access @: http://localhost:4000

  - Run using /etc/init.d/dahboard start/stop/restart (File: dashboard.bash)
    copy dashboard.bash to /etc/init.d 
    Note: the paths, environment and port are already set in the file. (change according to server config) 

  - Nginx example configuration (File: nginx.conf)<br/>
    Note: The NodeJS server is currently serving everything including static files. If you decide to use Nginx to serv      the static files comment the following in serv.js: <br/>
      - app.use(express.static(__dirname + '/static-dev')); <br/>
      - app.use(express.static(__dirname + '/static'));<br/>
    The env variable will need to be shared with the Nginx configuration to properly serv the appropriate set of static     files (see enviromment definitions for more information) <br/>

  - Upstart example configuration (File: dashboard). upstart can be used to:
    - Run NodeJS as a deamon<br/>
    - Provide an easy way to start and stop the server<br/>
      (sbin/start dashboard ---- sbin/stop dashboard)<br/>

  - Monit example configuration (File: monitrc)

Storing routine
===============
  - Using Cron, saving routine is scheduled every hour on the 10 minutes mark. 
  - sys/storeData.js is responsible for saving new sets of data periodically.
  - The file runs automatically and reads from _DIR: /home/cslab/DATA if 2 or more files exist.
    Note: the directory name is set in func: saveData() in storeData.js please change to the directory containing the       exported files from the JC system. 
  - $ node sys/storeData.js _DIR _NEWFL _OLDFL<br/>
    to store data manually in the database where:
    - _DIR: is the directory containing the exported files from the JC system.
    - _NEWFL: the file that needs to be proccessed in the form (mmddyyyy<b>D</b>.csv)
    - _OLDFL: the file of the previous day in the same form as _NEWFL
  - The current database used is called dashboard and the connection to it is assigned in 2 places:
    - storeData.js (connection using mongojs)
    - sev.js (connection using mongoose) 
  - Currently no authentication is required for the datatbase connection (will change according to host config)

Fast Queries
============
// New API 
  - /api/getBuildings
  - /api/buildinginfo/:building_code
// OLD AND DEPRCATED
  - /db/dataHour/-<i>date</i>-/-<i>building</i>-
  - /db/dataDaily/-<i>date-from</i>-/-<i>date-to</i>-/-<i>building</i>-
  - /db/dataForWeek/-<i>building</i>-
  - /db/dataForMonth/-<i>building</i>-
  - /db/dataForYear/-<i>building</i>-
  - /db/campusConsumption <br/>
  - /db/buildingInfo/-<i>building</i>-<br/>
  <i>building</i>: refers to the building code<br/>
  <i>date</i>, <i>date-from</i>, <i>date-to</i>: the date formated 'mm-dd-yyyy'

Server Structure
================
  SOON :)

NodeJS modules
==============
  - expressJS (npm install express)<br/>
  - mongooseJS (npm install mongoose)<br/>
  - cronJS (npm install cron)<br/>
  - mongoJS (npm install mongojs)<br/>
  - ejs (npm install ejs)<br/>
  - sys (npm install sys)<br/>
  - dateable (npm install dateable)<br/>

License
=======
  <a href="http://www.gnu.org/licenses/gpl.txt">GPL</a> 
