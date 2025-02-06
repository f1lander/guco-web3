// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IGucoGame {
    struct Level {
        uint8[] levelData; // Changed from bytes32 to uint8[]
        address creator;
        uint256 playCount;
        uint256 completions;
        bool verified;
    }

    struct Achievement {
        string name;
        string description;
        uint256 points;
        bool unlocked;
    }

    struct Player {
        uint256 levelsCompleted;
        uint8[][] completedLevels;
    }

    event LevelCreated(uint256 indexed levelId, address indexed creator);
    event LevelCompleted(
        uint256 indexed levelId,
        address indexed userAddress,
        uint256 completionTime
    );
}
