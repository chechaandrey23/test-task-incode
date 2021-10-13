# React Test Task

Implemented:
- displaying and updating tickers
- minimum ticker and full ticker using double click
- adding and removing ticker
- hide and show ticker
- change ticker update timeout
- stop and start ticker update
- change the order of displayed tickers using drag and drop

Tests(only with runing backend):
- render with out connect(pre connect)
- render with first iteration tickers
- render with first and second iteration tickers
- render min and max with double click
- render: min-ticker -> max-ticker -> min-ticker
- drag & drop
- create ticker
- create ticker with error
- delete ticker
- delete(create ticker & delete ticker) ticker
- hide ticker
- hide(create & hide) ticker
- hide(first ticker & last ticker) & show tickers
- set new timeout update tickers
- set new timeout(with error)
- stop & start tickers update

Install:
- clone repo
- Running the local service
1. Open a new bash shell
2. ```cd server```
3. ```npm install``` or ```yarn install```
4. ```npm run start``` or ```yarn start```
- Run your application
1. Open a new bash shell
2. ```cd client```
3. ```npm install``` or ```yarn install```
4. ```npm run start``` or ```yarn start```
- Run the tests
1. ```Open a new bash shell```
2. ```cd client```
3. ```npm run test or yarn test```
