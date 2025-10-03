// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Television is Ownable {
    using SafeERC20 for IERC20;

    uint256 public constant FEE = 1_000;
    uint256 public constant DIVISOR = 10_000;
    uint256 public constant PRECISION = 1e18;
    uint256 public constant EPOCH_PERIOD = 1 days;
    uint256 public constant PRICE_MULTIPLIER = 2e18;
    uint256 public constant MIN_INIT_PRICE = 1e6;
    uint256 public constant ABS_MAX_INIT_PRICE = type(uint192).max;

    address public immutable quote;
    address public treasury;

    struct Slot0 {
        uint8 locked;
        uint16 epochId;
        uint192 initPrice;
        uint40 startTime;
        address owner;
        string uri;
    }

    Slot0 internal slot0;

    error Television__Reentrancy();
    error Television__Expired();
    error Television__EpochIdMismatch();
    error Television__MaxPaymentAmountExceeded();
    error Television__InvalidTreasury();

    event Television__Takeover(address indexed from, address indexed channelOwner, uint256 paymentAmount);

    modifier nonReentrant() {
        if (slot0.locked == 2) revert Television__Reentrancy();
        slot0.locked = 2;
        _;
        slot0.locked = 1;
    }

    modifier nonReentrantView() {
        if (slot0.locked == 2) revert Television__Reentrancy();
        _;
    }

    constructor(address _quote) {
        quote = _quote;

        slot0.initPrice = uint192(MIN_INIT_PRICE);
        slot0.startTime = uint40(block.timestamp);
        slot0.owner = msg.sender;
    }

    function takeover(string memory uri, address channelOwner, uint256 epochId, uint256 deadline, uint256 maxPaymentAmount) external nonReentrant returns (uint256 paymentAmount) {
        if (block.timestamp > deadline) revert Television__Expired();

        Slot0 memory slot0Cache = slot0;

        if (uint16(epochId) != slot0Cache.epochId) revert Television__EpochIdMismatch();

        paymentAmount = getPriceFromCache(slot0Cache);
        if (paymentAmount > maxPaymentAmount) revert Television__MaxPaymentAmountExceeded();

        if (paymentAmount > 0) {
            if (treasury != address(0)) {
                IERC20(quote).safeTransferFrom(msg.sender, treasury, paymentAmount * FEE / DIVISOR);
                IERC20(quote).safeTransferFrom(msg.sender, slot0Cache.owner, paymentAmount - (paymentAmount * FEE / DIVISOR));
            } else {
                IERC20(quote).safeTransferFrom(msg.sender, slot0Cache.owner, paymentAmount);
            }
        }

        uint256 newInitPrice = paymentAmount * PRICE_MULTIPLIER / PRECISION;

        if (newInitPrice > ABS_MAX_INIT_PRICE) {
            newInitPrice = ABS_MAX_INIT_PRICE;
        } else if (newInitPrice < MIN_INIT_PRICE) {
            newInitPrice = MIN_INIT_PRICE;
        }

        unchecked {
            slot0Cache.epochId++;
        }
        slot0Cache.initPrice = uint192(newInitPrice);
        slot0Cache.startTime = uint40(block.timestamp);
        slot0Cache.owner = channelOwner;
        slot0Cache.uri = uri;

        slot0 = slot0Cache;

        emit Television__Takeover(msg.sender, channelOwner, paymentAmount);

        return paymentAmount;
    }

    function getPriceFromCache(Slot0 memory slot0Cache) internal view returns (uint256) {
        uint256 timePassed = block.timestamp - slot0Cache.startTime;

        if (timePassed > EPOCH_PERIOD) {
            return 0;
        }

        return slot0Cache.initPrice - slot0Cache.initPrice * timePassed / EPOCH_PERIOD;
    }

    function setTreasury(address _treasury) external onlyOwner {
        if (_treasury == address(0)) revert Television__InvalidTreasury();
        treasury = _treasury;
    }

    function getPrice() external view nonReentrantView returns (uint256) {
        return getPriceFromCache(slot0);
    }

    function getSlot0() external view nonReentrantView returns (Slot0 memory) {
        return slot0;
    }
}

