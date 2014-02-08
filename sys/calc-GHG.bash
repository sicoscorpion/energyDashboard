#! /bin/bash
# Calculates GHG emission

PKW=$1
CO2E=`echo "1891 * 0.001" | bc -l`

EMM=`echo "$1 * $CO2E" | bc -l`
echo "$EMM"
