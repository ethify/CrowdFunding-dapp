pragma solidity ^0.5.0;

import "./Project.sol";

contract FundingHub {

    address payable public owner;
    uint public numOfProjects;

    mapping (uint => address) public projects;

    event LogProjectCreated(uint id, string title, address addr, address creator);
    event LogContributionSent(address projectAddress, address contributor, uint amount);

    event LogFailure(string message);

    modifier onlyOwner {
        require(owner == msg.sender,"Permissioned required");
        _;
    }

    constructor() public{
        owner = msg.sender;
        numOfProjects = 0;
    }

    /**
    * Create a new Project contract
    * [0] -> new Project contract address
    */
    function createProject(uint _fundingGoal, uint _deadline, string memory _title) public payable returns (Project projectAddress) {

        require(_fundingGoal > 0,"Project funding goal must be greater than 0");

        require(block.number < _deadline,"Project deadline must be greater than the current block");

        Project p = new Project(_fundingGoal, _deadline, _title, msg.sender);
        projects[numOfProjects] = address(p);
        emit LogProjectCreated(numOfProjects, _title, address(p), msg.sender);
        numOfProjects++;
        return p;
    }

    /**
    * Allow senders to contribute to a Project by it's address. Calls the fund() function in the Project
    * contract and passes on all value attached to this function call
    * [0] -> contribution was sent
    */
    function contribute(address _projectAddress) public payable returns (bool successful) {

        // Check amount sent is greater than 0
        require(msg.value > 0,"Contributions must be greater than 0 wei");

        Project deployedProject = Project(_projectAddress);

        // Check that there is actually a Project contract at that address
        require(deployedProject.fundingHub() == address(0), "Project contract not found at address");

        // Check that fund call was successful
        if (deployedProject.fund.value(msg.value)(msg.sender)) {
            emit LogContributionSent(_projectAddress, msg.sender, msg.value);
            return true;
        } else {
            emit LogFailure("Contribution did not send successfully");
            return false;
        }
    }

    function kill() public onlyOwner {
        selfdestruct(owner);
    }

    /**
    * Don't allow Ether to be sent blindly to this contract
    */
    function() external {
        revert("...");
    }
}