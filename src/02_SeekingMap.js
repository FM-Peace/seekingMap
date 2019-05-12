//---------------------------------
// 索敵マップ処理
// 作成者：FlatMountain
//---------------------------------

var seekingMapManager = new SeekingMapManager();

(function () {
    var alias1 = MapLayer.drawMapLayer;
    MapLayer.drawMapLayer = function () {
        alias1.call(this);
        if (seekingMapManager.isSightMode()) {
            var session = root.getCurrentSession();

            var drawStartX = Math.floor(session.getScrollPixelX() / GraphicsFormat.MAPCHIP_WIDTH);
            var drawStartY = Math.floor(session.getScrollPixelY() / GraphicsFormat.MAPCHIP_HEIGHT);

            var drawStartIndex = CurrentMap.getIndex(drawStartX, drawStartY);

            var array = [];

            for (var y = 0; y < CurrentMap.getRow(); y++) {
                for (var x = 0; x < CurrentMap.getCol(); x++) {
                    array.push(drawStartIndex + x + y * CurrentMap.getWidth());
                }
            }

            if (session.getScrollPixelX() % GraphicsFormat.MAPCHIP_WIDTH !== 0) {
                for (var y = 0; y < CurrentMap.getRow(); y++) {
                    array.push(drawStartIndex + CurrentMap.getCol() + y * CurrentMap.getWidth());
                }
            }

            if (session.getScrollPixelY() % GraphicsFormat.MAPCHIP_HEIGHT !== 0) {
                for (var x = 0; x < CurrentMap.getCol(); x++) {
                    array.push(drawStartIndex + x + CurrentMap.getRow() * CurrentMap.getWidth());
                }
            }

            var drawIndexArray = [];

            for (var i = 0; i < array.length; i++) {
                var index = array[i];
                if (!seekingMapManager.isVisible(index, UnitType.PLAYER)) {
                    drawIndexArray.push(index);
                }
            }

            root.drawFadeLight(drawIndexArray, 0xffffff, 123);
        }
    };
})()