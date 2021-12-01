Consensys Academy - Blockchain Developer Bootcamp Final Project

****Title - GameFarm

****Author - Joseph Annuzzi Jr

****Project Description
The GameFarm smart contract allows users to participate in a game that accrues participants who pay in ether to begin harvesting in the game. There are 5 farming rates of harvest made available in the contract by the owner, and each rate has a different cost of ether, pays a different amount of points, and has a different length of block maturity time. Once a harvest is mature, a user can claim the points due to them, and the owner may also withdrawal the accrued ether earned by the GameFarm contract


****GameFarm Workflow
1. The owner will create various farm rates that users can harvest
2. Users will have to create a harvest on the contract to being playing the game
3. They have to identify which farm rate they want to use for creating their harvest
4. They have to submit the harvest for that particular farm rate
5. They can have as many harvests going as they can afford to purchase with eth
6. A harvest takes a partciulate amount of blocks to mature
7. Once mature, a user can complete the harvest and earn points
8. The contract owner is able to collect the fees earned by the contract for users playing


****Installation
1. make sure you have nodejs and npm installed
2. From the directory of your choice and from a command line, run "gh repo clone lambo4jos/blockchain-developer-bootcamp-final-project"
3. Navigate down into the project root
4. npm install -g truffle
From within the root directory
5. npm install @openzeppelin/contracts
6. npm install --save-dev chai
7. npm install --save-dev chai-as-promised
8. npm install dotenv
Navigate into the client subdirectory from the root with "cd client" then
9. npm install


****Running the Project for local development after installation is complete
1. Launch the Ganache GUI
2. Go into the Ganache settings
3. Select the Server tab
4. Set Network ID to 1337 so that it can work with Metamask on localhost:8545
5. Make sure the port number is also 8545
6. The truffle-config.js file is already configured for running development on port 8545 and network ID 1337 so there is nothing to configure there
7. Navigate ito the project root directory
8. from a command prompt, type "truffle migrate" to deploy the GameFarm to the Ganache blockchain and to populate the initial farming rates with the migration script, or you can type "truffle migrate --reset" if you want to reset the blockchain with new data if you have already been working with the project
9. To test the project, from within the same root directory, type "truffle test"
10. Now that the smart contracts have been deployed onto the Ganache GUI blockchain, navigate from the command line into the client subdirectory of the project root, where the react app resides. But before proceeding, make sure you have installed all the react app dependencies in this client subdirectory by typing "npm install" as listed in the section above
11. Within this client directory after all dependencies have been installed, type "npm start" to launch the react client in a browser that you have already installed Metamask
12. Once the browser opens and the client application loads on the localhost with port 3000 (localhost:3000), you are now able to interact with the GameFarm client application which is the front end for the GameFarm smart contracts deployed on the Ganache GUI
13. Once the client is ready, you may press a button that says "Connect Metamask" which will ask you to connect to the site
14. Once connected, data will populate the screen with 5 farming rates which list their cost in ether, and the requirements for how long they take tof farm, along with the reward paid once farming is complete
15. You may start harvesting a farming rate by pressing the button "Create Harvest" for the particular harvest that you want to farm. This will bring up Metamask with a transaction that will charge your eth account an amount of ether to farm that farming rate, and once you confirm the transaction in metamask, and send the transaction to the blockchain, and once it completes, it will allow you to view below the Available farm rates on the client application, what farming rates you are currently harvesting, and whether you harvests have come to maturity or not yet
16. If any of your havests are complete, there will be a Clickable button that says "Claim Harvest". When you click that button, another transaction will register with metamask asking you to confirm, and once the transaction completes, your score is updated with how many points you have accrued in the game farm. If a harvest is not complete, you will not be able to click the "Claim Harvest" button


****Running the Unit Tests
Make sure you are in the project root directory. Use the following command to run the Unit Tests:

truffle test

Please see the tests inside /test/game-farm.js


Running a Script Simulation
Make sure you are in the project root directory. Once in the directory, you can run the following command to execute the script simulation for running the game

truffle exec scripts/run-game.js

Once executed, you are able to see an output which simulates a user who creates many harvests and outputs their score, and also claims their harvest points once a harvest has reached maturity. Being that there are different maturity rates for each harvest created, the points accrue at various times during the simulation showing the different progress of the points accumulation. The simulator also shows the balance of ether the contract earns from the simulation and shows the balance of the owners/creators address before and after withdrawing the ether from the contract. This is a very primitive simulator but could be improved given the time and effort


****Project Structure
root
    client
        node_modules
        public
        src
            abis
    contracts
    docs
    migrations
    node_modules
    scripts
    test
    .env
    .gitignore
    avoiding_common_attacks.md
    deployed_address.txt
    design_pattern_decisions.md
    package.json
    README.md
    solidity-scaffolding.md
    truffle-config.js


****Frontend Project Access


****Screencast Walkthrough


****Public Ethereum Account Address to receive NFT certification
    0xC708A6Ba452eb73c0d7B0799fA7B65c0953b5030
