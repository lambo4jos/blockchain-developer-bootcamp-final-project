Final Project Security Measures Implemented

SWC-105	Unprotected Ether Withdrawal
Relationship: CWE-284: Improper Access Control

1. Proper Use of Require for Access Control - Using the OpenZepellin Ownable.sol onlyOwner modifier which implements the proper use of require statement for enforcing proper access control. Also, the withdrawal() method has a require that ensures that the withdrawal has been sent and if not, fails.


SWC-104 Unchecked Call Return Value
Relationship: CWE-252: Unchecked Return Value

2. Proper Use of .call - The withdrawal() method uses the .call method using the current best practice for executing an ether transaction to send from the contracts balance to the contract owners adddress. Only the owner is able to execute the withdrawal() method for claiming the balance of ether in the GameFarm contract.