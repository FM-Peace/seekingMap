# 索敵マップスクリプト

### 作成者
FM_Peace

### 概要
FEで言う索敵マップを作成できます。  
設定された軍の視界内のみ画面上に描画され、視界害のユニットを確認することができなくなります。  

また、視界外の別軍と衝突した際はそのターンの行動を強制的に終了します。

### スクリプト導入方法
1. srcディレクトリ以下のjsファイルをscriptディレクトリ以下に配置
2. マップのカスタムパラメータ「seekingMapType」にseekingMap_Manager.jsの「SeekingMapDrawInfo」で定義した定数を設定
3. グローバルパラメータ「isUnitSightDrawable」を下記の書式で登録
```
isUnitSightDrawable:{
  PLAYER:（プレイヤーの視界範囲内を描画するのであればtrue, そうでなければfalse）,
  ENEMY:（敵軍の視界範囲内を描画するのであればtrue, そうでなければfalse）,
  ALLY:（同盟軍の視界範囲内を描画するのであればtrue, そうでなければfalse）
}
```

### 待機アニメの利用方法（リソースを利用）
1. グローバルパラメータ「forcedWaitAnime」を下記の書式で登録
```
forcedWaitAnime:{
  isResource:true,
  resourceName:（リソースのファイル名）
}
```

### 待機アニメの利用方法（ランタイムエフェクトを利用）
1. グローバルパラメータ「forcedWaitAnime」を下記の書式で登録
```
forcedWaitAnime:{
  isResource:false,
  isRuntime:true,
  effectId:（ランタイムエフェクトのID）
}
```

### 待機アニメの利用方法（オリジナルエフェクトを利用）
1. 作成したsaniファイルをプロジェクトにインポート
2. グローバルパラメータ「forcedWaitAnime」を下記の書式で登録
```
forcedWaitAnime:{
  isResource:false,
  isRuntime:false,
  effectId:（オリジナルエフェクトのID）
}
```