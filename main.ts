namespace SpriteKind {
    export const ptype = SpriteKind.create()
}
function doLCARS () {
    state = lcs
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.ptype)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer0, assets.image`blank`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`blank`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer2, assets.image`blank`)
    scene.setBackgroundColor(15)
    scene.setBackgroundImage(assets.image`lcars`)
}
function setSpace () {
    state = travel
    scene.setBackgroundImage(assets.image`NOLCARS`)
    scene.setBackgroundColor(15)
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer0, assets.image`test1`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`test0`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer2, assets.image`test2`)
    setScroll(dir)
    if (dir == -1) {
        ship = sprites.create(assets.image`Enterprise`, SpriteKind.Player)
    } else {
        ship = sprites.create(assets.image`Enterprise0`, SpriteKind.Player)
    }
    controller.moveSprite(ship)
    ship.setStayInScreen(true)
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (state == travel) {
        doLCARS()
    } else {
        if (state == lcs) {
            setSpace()
        }
    }
})
function setScroll (drc: number) {
    scroller.scrollBackgroundWithSpeed(drc * 30, 0, scroller.BackgroundLayer.Layer0)
    scroller.scrollBackgroundWithSpeed(drc * 50, 0, scroller.BackgroundLayer.Layer1)
    scroller.scrollBackgroundWithSpeed(drc * 60, 0, scroller.BackgroundLayer.Layer2)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (state == travel) {
        doPhaser()
    }
    if (state == lcs) {
        sprites.destroyAllSpritesOfKind(SpriteKind.Text)
        sprites.destroyAllSpritesOfKind(SpriteKind.ptype)
        doMissTXT("Mission to " + places[randint(0, 3)])
    }
})
function doMissTXT (text: string) {
    textSprite = textsprite.create(text)
    textSprite.setPosition(95, 44)
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (state == travel) {
        ship.setImage(assets.image`Enterprise0`)
        dir = 1
        setScroll(dir)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (state == travel) {
        ship.setImage(assets.image`Enterprise`)
        dir = -1
        setScroll(dir)
    }
})
function doPhaser () {
    if (state == travel) {
        zap = sprites.createProjectileFromSprite(assets.image`bolt`, ship, -200 * dir, 0)
        music.pewPew.play()
        zap.setFlag(SpriteFlag.AutoDestroy, true)
    }
}
let orb: Sprite = null
let zap: Sprite = null
let textSprite: TextSprite = null
let ship: Sprite = null
let state = 0
let places: string[] = []
let lcs = 0
let travel = 0
let dir = 0
dir = -1
travel = 1
lcs = 2
setSpace()
places = [
"Ectis II",
"Arnath",
"Torrassa",
"Inxtis"
]
let planets = [
assets.image`Planet1`,
assets.image`Planet2`,
assets.image`Planet3`,
assets.image`Planet4`
]
forever(function () {
    pause(1000 * randint(2, 10))
    if (state == travel) {
        orb = sprites.create(planets[randint(0, 3)], SpriteKind.ptype)
        orb.setPosition(152, randint(20, 100))
        orb.setVelocity(-37, 0)
        orb.setFlag(SpriteFlag.AutoDestroy, true)
    }
})
