//---------------------------------
//索敵マップ処理の移動処理.
//作成者：FlatMountain
//---------------------------------

(function () {
    var alias1 = SimulateMove.drawUnit;
    SimulateMove.drawUnit = function () {
        var x = Math.floor(this._xPixel / GraphicsFormat.MAPCHIP_WIDTH);
        var y = Math.floor(this._yPixel / GraphicsFormat.MAPCHIP_HEIGHT);
        var index = CurrentMap.getIndex(x, y);

        if (SeekingMapManager.isInvisiblePanel(index, UnitType.PLAYER) && this._unit.getUnitType() === UnitType.ENEMY) {
            return;
        }

        alias1.call(this);
    };

    var alias2 = SimulateMove._playMovingSound;
    SimulateMove._playMovingSound = function () {
        var x = Math.floor(this._xPixel / GraphicsFormat.MAPCHIP_WIDTH);
        var y = Math.floor(this._yPixel / GraphicsFormat.MAPCHIP_HEIGHT);
        var index = CurrentMap.getIndex(x, y);

        if (SeekingMapManager.isInvisiblePanel(index, UnitType.PLAYER) && this._unit.getUnitType() === UnitType.ENEMY) {
            return;
        }

        alias2.call(this);
    };

    var alias3 = SimulateMove._controlScroll;
    SimulateMove._controlScroll = function (dx, dy) {
        var x = Math.floor(this._xPixel / GraphicsFormat.MAPCHIP_WIDTH);
        var y = Math.floor(this._yPixel / GraphicsFormat.MAPCHIP_HEIGHT);
        var index = CurrentMap.getIndex(x, y);

        if (SeekingMapManager.isInvisiblePanel(index, UnitType.PLAYER) && this._unit.getUnitType() === UnitType.ENEMY) {
            return;
        }

        alias3.call(this, dx, dy);
    };

    var alias4 = CourceBuilder.createRangeCource;
    CourceBuilder.createRangeCource = function (unit, goalIndex, simulator) {
        return this._createNewCource(unit, alias4.call(this, unit, goalIndex, simulator));
    };

    var alias5 = CourceBuilder.createLongCource;
    CourceBuilder.createLongCource = function (unit, goalIndex, simulator) {
        return this._createNewCource(unit, alias5.call(this, unit, goalIndex, simulator));
    };

    var alias6 = CourceBuilder.createExtendCource;
    CourceBuilder.createExtendCource = function (unit, goalIndex, simulator) {
        return this._createNewCource(unit, alias6.call(this, unit, goalIndex, simulator));
    };

    var alias7 = CourceBuilder.getValidGoalIndex;
    CourceBuilder.getValidGoalIndex = function (unit, goalIndex, simulator, moveAIType) {
        return this._createNewCource(unit, alias7.call(this, unit, goalIndex, simulator, moveAIType));
    };

    CourceBuilder._createNewCource = function (unit, cource) {
        var newCource = [];
        var x = unit.getMapX();
        var y = unit.getMapY();

        for (var i = 0; i < cource.length; i++) {
            x += XPoint[cource[i]];
            y += YPoint[cource[i]];

            if (SeekingMapManager.isExistInvisibleUnit(x, y, unit.getUnitType())) {
                SeekingMapManager.setForcedWaitUnit(unit);
                break;
            }

            newCource.push(cource[i]);
        }

        return newCource;
    };
})();