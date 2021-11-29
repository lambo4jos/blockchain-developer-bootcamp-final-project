Consensys Academy - Blockchain Developer Bootcamp Final Project

Author - Joseph Annuzzi Jr

Project Description
The GameFarm smart contract allows users to participate in a game that accrues participants who pay in ether to begin harvesting in the game. There are 5 farming rates of harvest made available in the contract by the owner, and each rate has a different cost of ether, pays a different amount of points, and has a different length of block maturity time. Once a harvest is mature, a user can claim the points due to them, and the owner may also withdrawal the accrued ether earned by the GameFarm contract

GameFarm Workflow
1. The owner will create various farm rates that users can harvest
2. Users will have to create a harvest on the contract to being playing the game
3. They have to identify which farm rate they want to use for creating their harvest
4. They have to submit the harvest for that particular farm rate
5. They can have as many harvests going as they can afford to purchase with eth
6. A harvest takes a partciulate amount of blocks to mature
7. Once mature, a user can complete the harvest and earn points
8. The contract owner is able to collect the fees earned by the contract for users playing


****Installation


****Running the Project


****Running the Unit Tests
Make sure you are in the project root directory. Use the following command to run the Unit Tests:

truffle test

Please see the tests inside /test/game-farm.js


Running a Script Simulation
Make sure you are in the project root directory. Once in the directory, you can run the following command to execute the script simulation for running the game

truffle exec scripts/run-game.js

Once executed, you are able to see an output which simulates a user who creates many harvests and outputs their score, and also claims their harvest points once a harvest has reached maturity. Being that there are different maturity rates for each harvest created, the points accrue at various times during the simulation showing the different progress of the points accumulation. The simulator also shows the balance of ether the contract earns from the simulation and shows the balance of the owners/creators address before and after withdrawing the ether from the contract. This is a very primitive simulator but could be improved given the time and effort


****Project Structure

****Frontend Project Access

****Screencast Walkthrough

****Public Ethereum Account to receive NFT certification
