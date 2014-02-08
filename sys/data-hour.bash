
#! /bin/bash


if [ ! -d "tmp-fetched" ]; then
    mkdir tmp-fetched
fi


progr_bar()
{
    MAX=$1
    PERCENT=0
    FOO=">"
    BAR=""

    while [ $PERCENT -lt $(($MAX+1)) ]
    do  
        echo -ne "\r\t[ "
        echo -ne "$BAR$FOO ] $((PERCENT*100/$MAX))% "
        BAR="${BAR}="
        let PERCENT=$PERCENT+1
        sleep 0.2
    done

    echo -e " Done.\n"
}


getAll(){
    INPUT=$1
    if [ ! -f $INPUT ] 
    then
        echo "No files fetched... (data-hour is broken)" 
        exit 1
    fi
 
    filename=`echo $1`

    export IFS=","
    lines=`cat $INPUT | wc -l`
    size=`expr $lines - 2`


    printf "\"date_time\",\"building_code\",\"info_status\",\"consumption\",\n" > $dataCSV.csv
    awk -F, 'length>NF+1' $INPUT | tail -$size | while read time NPR objName status objValue
    do
        date_time=`echo $time | sed 's/"//g'`
        building_code=`echo $objName | cut -f1 -d- | sed 's/"//g' | sed 's/"//g'`
        info_status=`echo $status | sed 's/"//g'`
        consum=`echo $objValue | sed 's/[a-zA-Z]//g' | sed 's/"//g'`
        consumption=`echo $consum | tr -d '\040\010\012\015' | sed 's/"//g'`
        printf "%s,%s,%s,%s,\n" $date_time $building_code $info_status $consumption
    done > $filename.csv

    echo "Data from `echo $1 | cut -c13-20` were sent to dataHour database!"
    # cat $dataCSV.csv 
    # iconv -f ascii -t utf-8 $dataCSV.csv > /dev/null 2>&1
    # mongoimport --db test --collection dataHour --type csv --headerline --file $dataCSV.csv --ignoreBlanks --upsert
    # rm $dataCSV.csv
    # rm $1 
}

files="tmp-fetched/*"
for file in $files; do
    progr_bar 1 && getAll $file
done