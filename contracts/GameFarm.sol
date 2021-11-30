// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/// @notice Ownable Inheritance and Access Control design pattern import
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A simple game-like farming mechanic
/// @author Joseph Annuzzi Jr
/// @notice You can use this contract for only the most basic game-like farming
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract
contract GameFarm is Ownable {

    /// @notice FarmRate struct
    /// @param id The FarmRate id to keep track of different rates
    /// @param owner The owner of the contract is only allowed to create
    /// @param price The price in ETH this farm rate costs to farm
    /// @param payout The payout in points that get added to a users score in the game
    /// @param blockCount The number of blocks it takes to harvest this farm rate
    struct FarmRate {
        uint256 id;
        address owner;
        uint256 price;
        uint256 payout;
        uint256 blockCount;
    }

    /// @notice Harvest struct
    /// @param id The Harvest id to keep track of different harvests of a user
    /// @param owner The owner of the harvest who created it
    /// @param farmRateId The ID of the farmRate this harvest is harvesting
    /// @param startBlock The startBlock of the harvest when it was created
    /// @param endBlock The endBlock of the harvest from when it was created
    /// @param isClaimed Boolean noting if the harvest reward has been claimed
    struct Harvest {
        uint256 id;
        address owner;
        uint256 farmRateId;
        uint256 startBlock;
        uint256 endBlock;
        bool isClaimed;
    }

    address private _owner;
    uint256 _farmRateCount;

    /// @notice Array of FarmRate[] holding the games farm rates    
    FarmRate[] public farmRates;
    
    /// @notice User Harvest mapping and User Scores mapping
    mapping(address => Harvest[]) public userHarvests;
    mapping(address => uint256) public userScores;

    /// @notice Makes sure on deployment that the deployer is _owner
    constructor() {
        _owner = msg.sender;
    }

    /// @notice Receive Ether
    receive() external payable {}

    /// @notice Fallback function
    fallback() external payable {}

    /// @notice Get the ETH balance of this contracts address rounded up, for live trees
    /// @return The ETH balance of this contracts address
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Creates a new FarmRate
    /// @dev and adds it to an array of FarmRate[] then increments _farmRateCount
    /// @param _price The price in ETH this farm rate costs to farm
    /// @param _payout The payout in points that get added to a users score in the game
    /// @param _blockCount The number of blocks it takes to harvest this farm rate
    /// @return Boolean as true if the FarmRate has been created
    function createFarmRate(uint256 _price, uint256 _payout, uint256 _blockCount) public onlyOwner returns(bool) {
        farmRates.push(FarmRate(_farmRateCount, msg.sender, _price, _payout, _blockCount));
        _farmRateCount = _farmRateCount + 1;
        return true;
    }

    /// @notice Gets a particular farm rate
    /// @param _id of the farm rate to get
    /// @return The particular farmRate
    function getFarmRate(uint256 _id) public view returns(FarmRate memory) {
        FarmRate memory farmRate = farmRates[_id];
        return farmRate;
    }

    /// @notice Gets all FarmRates of the game
    /// @return An array of FarmRate[]
    function getFarmRates() public view returns(FarmRate[] memory) {
        return farmRates;
    }

    /// @notice Creates a Harvest for the User
    /// @dev Payable function requires user to pay in ETH the farm rate price to create Harvest
    /// @param _farmRateId Accepts the farm rate ID for the Harvest
    /// @return Boolean as true if the harvest was created for the user
    function createUserHarvest(uint256 _farmRateId) public payable returns(bool) {
        FarmRate memory farmRate = getFarmRate(_farmRateId);
        require(msg.value != farmRate.price, "Must send exact price in ETH");
        Harvest memory harvest = Harvest(userHarvests[msg.sender].length, msg.sender, farmRate.id, block.number, block.number + farmRate.blockCount, false);
        userHarvests[msg.sender].push(harvest);
        return true;
    }
    
    /// @notice Gets the harvests for a user when an address matches
    /// @return Harvest[] for the addres sender of userHarvests
    function getUserHarvests() public view returns(Harvest[] memory) {
        return userHarvests[msg.sender];
    }

    /// @notice Claim the harvest score for a user when a claimable harvest is ready
    /// @param _harvestId Finds the harvest by ID
    /// @return Boolean if the harvest was claimed and score updated or false if not
    function claimHarvest(uint256 _harvestId) public returns(bool) {
        Harvest storage harvest = userHarvests[msg.sender][_harvestId];
        if(harvest.endBlock < block.number && harvest.isClaimed == false) {
            harvest.isClaimed = true;
            userScores[msg.sender] += getFarmRate(harvest.farmRateId).payout;
            return true;
        }
        return false;
    }

    /// @notice Gets the score
    /// @return The score of the msg.sender
    function getScore() public view returns(uint256) {
        return userScores[msg.sender];
    }

    /// @notice Allows the contract owner to withdrawal the ETH earned by the contract
    /// @dev Access control protects this payable function to the contract owner
    /// @dev Call returns a success or failure
    function withdrawal() public payable onlyOwner {
        (bool sent, bytes memory data) = (msg.sender).call{value: getBalance()}("");
        require(sent, "Failed to send Ether");
    }
}
