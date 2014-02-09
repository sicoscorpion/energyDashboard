Acadia Energy Dashboard
=======================
Acadia University Energy Dashboard Application
Usage
=====
  - To run the NodeJS server use:<br/> 
      $ NODE_ENV=<i>development</i> PORT=<i>4000</i> /usr/local/bin/node <i>/usr/local/www</i>/serv.js <br/>
      <i>env</i>: development or production <br/>
      <i>port</i>: port choosen for the NODEJS server <br/>
      <i>dir</i>: the root directory of the server <br/>
    Access @: http://localhost:4000<br/>
  - Nginx example configuration (File: nginx.conf)<br/> 
    <b>Note:</b> The NodeJS server is currently serving everything including static files. If youi decide to use Nginx to       serv the static file comment the following in serv.js: <br/>
      - app.use(express.static(__dirname + '/static-dev')); <br/>
      - app.use(express.static(__dirname + '/static'));<br/>
    The env variable will need to be shared with the Nginx configuration to properly serv the appropriate files (see          enviromment definitions for more information) <br/>
  - Upstart example configuration (File: dashboard):<br/>
      - Run NodeJS as a deamon<br/>
      - Provide an easy way to start and stop the server<br/>
        (sbin/start dashboard ---- sbin/stop dashboard)<br/>

  - Monit example configuration (File: monitrc)

Server Structure
================

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
