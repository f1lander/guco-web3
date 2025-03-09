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

    function createLevel(bytes32 levelData) external returns (uint256) {
        uint256 levelId = _nextLevelId++;
        levels[levelId] = Level({
            levelData: levelData,
            creator: msg.sender,
            playCount: 0,
            completions: 0,
            verified: false,
            createdAt: block.timestamp
        });

        playerLevelCount[msg.sender]++;
        emit LevelCreated(levelId, msg.sender);
        return levelId;
    }

    function getLevelData(uint256 levelId) external view returns (bytes32) {
        return levels[levelId].levelData;
    }

    function getLevel(uint256 levelId) external view returns (Level memory) {
        return levels[levelId];
    }

    function getLevelCount() external view returns (uint256) {
        return _nextLevelId;
    }

    function getLevels(
        uint256 offset,
        uint256 limit
    ) external view returns (Level[] memory) {
        uint256 totalLevels = _nextLevelId;
        uint256 end = offset + limit;

        if (end > totalLevels) {
            end = totalLevels;
        }

        Level[] memory result = new Level[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = levels[i];
        }

        return result;
    }

    function getLevelsWithId(
        uint256 offset,
        uint256 limit
    ) external view returns (LevelWithId[] memory) {
        uint256 totalLevels = _nextLevelId;
        uint256 end = offset + limit;

        if (end > totalLevels) {
            end = totalLevels;
        }

        LevelWithId[] memory result = new LevelWithId[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = LevelWithId({id: i, level: levels[i]});
        }

        return result;
    }

    function getPlayer(address player) external view returns (Player memory) {
        return players[player];
    }

    function updatePlayer(
        address player,
        uint256 levelId,
        Level calldata levelCompleted
    ) external {
        Player storage _player = players[player];
        _player.levelsCompleted += 1;
        _player.completedLevels.push(levelCompleted);

        // Mark the level as completed for this player
        playerCompletedLevels[player][levelId] = true;
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
