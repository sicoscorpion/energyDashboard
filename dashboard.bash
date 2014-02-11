# Copy the script to /etc/init.d to start/stop/restart our server.
# Note that this will run the server in production envirnoment and on port 4000 given that all paths are valid 

#!/bin/bash
DIR=/usr/local/www/dashboard
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
NODE_PATH=/usr/local/lib/node_modules
NODE=/usr/local/bin/node

test -x $NODE || exit 0

function start_app {
  NODE_ENV=production PORT=4000 nohup "$NODE" "$DIR/serv.js" 1>>"$DIR/logs/dashboard.log" 2>&1 &
  echo $! > "$DIR/pids/dashboard.pid"
}

function stop_app {
  kill `cat $DIR/pids/dashboard.pid`
}

case $1 in
   start)
      start_app ;;
    stop)
      stop_app ;;
    restart)
      stop_app
      start_app
      ;;
    *)
      echo "usage: dashboard {start|stop}" ;;
esac
exit 0