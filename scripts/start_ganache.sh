pid=$(lsof -i:8545 -t); kill -TERM $pid || kill -KILL $pid

../node_modules/.bin/ganache-cli -p 8545 -m "whip venture public clip similar debris minimum mandate despair govern rotate swim"