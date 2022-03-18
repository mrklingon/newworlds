namespace SpriteKind {
    export const ptype = SpriteKind.create()
    export const asteroid = SpriteKind.create()
}
function doLCARS () {
    state = lcs
    droid = 0
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.ptype)
    sprites.destroyAllSpritesOfKind(SpriteKind.asteroid)
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
    ship = sprites.create(assets.image`Enterprise`, SpriteKind.Player)
    setScroll(dir)
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
    if (drc == -1) {
        ship.setImage(assets.image`Enterprise`)
    } else {
        ship.setImage(assets.image`Enterprise0`)
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (state == travel) {
        doPhaser()
    }
    if (state == lcs) {
        if (destination == "") {
            sprites.destroyAllSpritesOfKind(SpriteKind.Text)
            sprites.destroyAllSpritesOfKind(SpriteKind.ptype)
            sprites.destroyAllSpritesOfKind(SpriteKind.asteroid)
            missdest = randint(0, 3)
            doMissTXT("Mission to " + places[missdest], job[randint(0, 3)])
        } else {
            M5()
            setSpace()
        }
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.asteroid, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    otherSprite.destroy(effects.fire, 500)
    hitShip()
})
function doMissTXT (dest: string, mission: string) {
    textSprite = textsprite.create(dest)
    textSprite.setPosition(95, 44)
    ts2 = textsprite.create(mission)
    ts2.setPosition(96, 96)
    destination = dest
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.ptype, function (sprite, otherSprite) {
    setScroll(0)
    otherSprite.setVelocity(0, 0)
    sprite.setVelocity(0, 0)
    sprite.sayText("Arrived at" + places[missdest], 500, true)
    otherSprite.setVelocity(50, -47)
    setScroll(dir)
    info.changeScoreBy(50)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (state == travel) {
        ship.setImage(assets.image`Enterprise0`)
        dir = 1
        setScroll(dir)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (controller.left.isPressed()) {
        M5()
    }
    if (state == travel) {
        ship.setImage(assets.image`Enterprise`)
        dir = -1
        setScroll(dir)
    }
})
function M5 () {
    droid += 1
    if (droid > 1) {
        droid = 0
        ship.sayText("M5 deactivated", 500, false)
    } else {
        ship.sayText("M5 activated", 500, false)
    }
}
function hitShip () {
    music.knock.play()
    scene.cameraShake(4, 500)
    if (dir == -1) {
        ship.setImage(assets.image`Enterprise-hit`)
        pause(200)
        ship.setImage(assets.image`Enterprise`)
    } else {
        ship.setImage(assets.image`Enterprise-hit0`)
        pause(200)
        ship.setImage(assets.image`Enterprise0`)
    }
}
function doPhaser () {
    if (state == travel) {
        zap = sprites.createProjectileFromSprite(assets.image`bolt`, ship, -200 * dir, 0)
        music.pewPew.play()
        zap.setFlag(SpriteFlag.AutoDestroy, true)
    }
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.asteroid, function (sprite, otherSprite) {
    info.changeScoreBy(randint(20, 50))
    music.knock.play()
    otherSprite.destroy(effects.fire, 500)
})
let ast: Sprite = null
let planet: Sprite = null
let zap: Sprite = null
let ts2: TextSprite = null
let textSprite: TextSprite = null
let missdest = 0
let ship: Sprite = null
let state = 0
let droid = 0
let destination = ""
let job: string[] = []
let places: string[] = []
let lcs = 0
let travel = 0
let dir = 0
game.splash("Pilot the USS Verity", " for Romulan rescue missions")
dir = -1
travel = 1
info.setLife(10)
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
job = [
"transfer supplies",
"transfer refugees",
"consulting",
"gather assistance"
]
let rocks = [
assets.image`myImage`,
assets.image`myImage0`,
assets.image`myImage1`,
assets.image`myImage2`,
assets.image`myImage3`
]
destination = ""
droid = 0
forever(function () {
    pause(1000 * randint(2, 10))
    if (state == travel && destination != "") {
        destination = ""
        planet = sprites.create(planets[missdest], SpriteKind.ptype)
        planet.setPosition(152, randint(20, 100))
        planet.setVelocity(-37, 0)
        planet.setFlag(SpriteFlag.AutoDestroy, true)
    }
})
forever(function () {
    pause(500 * randint(2, 10))
    if (state == travel) {
        ast = sprites.create(rocks[randint(0, 4)], SpriteKind.asteroid)
        ast.setPosition(randint(20, 100), randint(20, 100))
        ast.setVelocity(randint(-40, 40), randint(-40, 40))
        ast.setFlag(SpriteFlag.AutoDestroy, true)
    }
})
forever(function () {
    if (1 == droid) {
        for (let index = 0; index < 4; index++) {
            ship.x += randint(-10, 10)
            ship.y += randint(-10, 10)
            if (5 < randint(0, 10)) {
                dir = -1
            } else {
                dir = 1
            }
            setScroll(dir)
            doPhaser()
            pause(500)
            sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
        }
    }
})
