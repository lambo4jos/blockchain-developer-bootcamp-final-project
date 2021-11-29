Final Project Design Patterns Used

1. Inheritance - The GameFarm contract inherits from the @openzeppelin/contracts/access/Ownable.sol contract so that the onlyOwner modifier can be set on contract methods where needed 

2. Access Control Design Pattern - This project uses the Access Control design patterns to restrict certain functions to allowing only the owner of the smart contract to execute those particular functions. Only the owner can create a new FarmRate for the contract. The FarmRate[] is populated at deployment and performed with the given rates in 2_deploy_migrations.js. The withdrawal() method allows only the owner to withdrawal the contracts balance of ether. 