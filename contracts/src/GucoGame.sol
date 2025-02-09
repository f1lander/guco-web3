// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {IGucoGame} from "./interfaces/IGucoGame.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract GucoGame is IGucoGame, Ownable {
    uint256 private _nextLevelId;

    mapping(uint256 => Level) public levels;
    mapping(address => Achievement[]) public playerAchievements;
    mapping(address => mapping(uint256 => bool)) public playerCompletedLevels;
    mapping(address => uint256) public playerLevelCount;
    mapping(address => Player) internal players;

    constructor() Ownable(msg.sender) {}

    function createLevel(
        uint8[] calldata levelData
    ) external returns (uint256) {
        uint256 levelId = _nextLevelId++;
        levels[levelId] = Level({
            levelData: levelData,
            creator: msg.sender,
            playCount: 0,
            completions: 0,
            verified: false
        });

        playerLevelCount[msg.sender]++;
        emit LevelCreated(levelId, msg.sender);
        return levelId;
    }

    function getLevelData(uint256 levelId) external view returns (uint8[] memory) {
        return levels[levelId].levelData;
    }

    function getLevel(uint256 levelId) external view returns (Level memory) {
        return levels[levelId];
    }

    function getPlayer(address player) external view returns (Player memory) {
        return players[player];
    }

    function updatePlayer(
        address player,
        Level calldata levelCompleted
    ) external {
        Player storage _player = players[player];
        _player.levelsCompleted += 1;
        _player.completedLevels.push(levelCompleted);
    }

    function getPlayerLevels(address player) external view returns (uint) {
        return playerLevelCount[player];
    }

    function isLevelCompleted(
        address player,
        uint256 levelId
    ) external view returns (bool) {
        return playerCompletedLevels[player][levelId];
    }
}
