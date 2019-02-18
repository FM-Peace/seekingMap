//---------------------------------
//索敵マップ処理のプレイヤーターン処理.
//作成者：FlatMountain
//---------------------------------

(function () {
    var alias1 = PlayerTurn._completeTurnMemberData;
    PlayerTurn._completeTurnMemberData = function () {
        alias1.call(this);
        if (SeekingMapManager.isSeekingMap()) {
            SeekingMapManager.updateUnitSight(UnitType.PLAYER);
        }
    };

    PlayerTurn._temporaryInvisibleUnitList = [];

    var alias2 = PlayerTurn.moveTurnCycle;
    PlayerTurn.moveTurnCycle = function () {
        this._temporaryInvisibleUnitList = SeekingMapManager.getInvisibleUnitList(UnitType.PLAYER);
        SeekingMapManager.setUnitIsInvisibleFromUnitList(this._temporaryInvisibleUnitList, true);

        result = alias2.call(this);

        SeekingMapManager.setUnitIsInvisibleFromUnitList(this._temporaryInvisibleUnitList, false);
        this._temporaryInvisibleUnitList = [];

        if (this.getCycleMode() !== PlayerTurnMode.UNITCOMMAND) {
            SeekingMapManager.updateUnitSight(UnitType.PLAYER);
        }

        return result;
    };


    var alias3 = MapSequenceCommand._completeSequenceMemberData;
    MapSequenceCommand._completeSequenceMemberData = function (parentTurnObject) {
        alias3.call(this, parentTurnObject);
        if (parentTurnObject.getTurnTargetUnit() === SeekingMapManager.getForcedWaitUnit()) {
            this.resetCommandManager();

            this._straightFlow.enterStraightFlow();

            this.changeCycleMode(MapSequenceCommandMode.FLOW);
        }
    };

    var alias4 = RepeatMoveFlowEntry._completeMemberData;
    RepeatMoveFlowEntry._completeMemberData = function (playerTurn) {
        if (playerTurn.getTurnTargetUnit() === SeekingMapManager.getForcedWaitUnit()) {
            return EnterResult.NOTENTER;
        }

        return alias4.call(this, playerTurn);
    };

    var alias5 = MapSequenceCommand._moveCommand;
    MapSequenceCommand._moveCommand = function () {
        var result = alias5.call(this);
        if (result === MapSequenceCommandResult.COMPLETE) {
            SeekingMapManager.updateUnitSight(UnitType.PLAYER);
        }

        return result;
    };

})();

// 待機関連.
(function () {
    UnitWaitFlowEntry._targetUnit = null;
    UnitWaitFlowEntry._unitCounter = null;

    var alias1 = UnitWaitFlowEntry.moveFlowEntry;
    UnitWaitFlowEntry.moveFlowEntry = function () {
        if (this._dynamicAnime.moveDynamicAnime() !== MoveResult.CONTINUE) {
            if (this._targetUnit.isInvisible()) {
                this._targetUnit.setInvisible(false);
            }

            return alias1.call(this);
        } else {
            if (this._targetUnit.isInvisible()) {
                this._unitCounter.moveUnitCounter();
            }
            return MoveResult.CONTINUE;
        }
    };

    UnitWaitFlowEntry._dynamicAnime = null;

    var alias2 = UnitWaitFlowEntry.drawFlowEntry;
    UnitWaitFlowEntry.drawFlowEntry = function () {
        alias2.call(this);

        if (this._targetUnit.isInvisible()) {
            this._drawUnit()
        }

        this._dynamicAnime.drawDynamicAnime();
    };

    UnitWaitFlowEntry._drawUnit = function () {
        var unitRenderParam = StructureBuilder.buildUnitRenderParam();

        unitRenderParam.direction = this._targetUnit.getDirection();
        unitRenderParam.animationIndex = this._unitCounter.getAnimationIndexFromUnit(this._targetUnit);
        unitRenderParam.isScroll = true;
        UnitRenderer.drawScrollUnit(this._targetUnit, this._targetUnit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH, this._targetUnit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT, unitRenderParam);
    };

    var alias3 = UnitWaitFlowEntry._prepareMemberData;
    UnitWaitFlowEntry._prepareMemberData = function (playerTurn) {
        alias3.call(this, playerTurn);
        this._dynamicAnime = createObject(DynamicAnime);
    };

    var alias4 = UnitWaitFlowEntry._completeMemberData;
    UnitWaitFlowEntry._completeMemberData = function (playerTurn) {
        var result = alias4.call(this, playerTurn);
        this._targetUnit = playerTurn.getTurnTargetUnit();

        if (this._targetUnit === SeekingMapManager.getForcedWaitUnit()) {
            this._startReactionAnime();
            SeekingMapManager.setForcedWaitUnit(null);
            this._unitCounter = createObject(UnitCounter);
            return EnterResult.OK;
        }

        return result;
    }

    UnitWaitFlowEntry._startReactionAnime = function () {
        var x = LayoutControl.getPixelX(this._targetUnit.getMapX());
        var y = LayoutControl.getPixelY(this._targetUnit.getMapY());
        var anime = SeekingMapManager.getForcedWaitAnimation();
        var pos = LayoutControl.getMapAnimationPos(x, y, anime);
        this._targetUnit.setInvisible(true);

        this._dynamicAnime.startDynamicAnime(anime, pos.x, pos.y, anime);
    };
})();

// 敵ユニット情報に関する処理.
(function () {
    var alias1 = MapParts.UnitInfo.drawMapParts;
    MapParts.UnitInfo.drawMapParts = function () {
        var unit = this.getMapPartsTarget();
        if (unit === null) {
            return;
        }

        index = CurrentMap.getIndex(unit.getMapX(), unit.getMapY());

        if (!SeekingMapManager.isInvisiblePanel(index, UnitType.PLAYER)) {
            alias1.call(this);
        }
    };

})();