/**
 * This is the main file for your project.
 *
 * Create images, tilemaps, animations, and songs using the
 * asset explorer in VS Code. You can reference those assets
 * using the tagged templates on the assets namespace:
 *
 *     assets.image`myImageName`
 *     assets.tilemap`myTilemapName`
 *     assets.tile`myTileName`
 *     assets.animation`myAnimationName`
 *     assets.song`mySongName`
 *
 * New to MakeCode Arcade? Try creating a new project using one
 * of the templates to learn about Sprites, Tilemaps, Animations,
 * and more! Or check out the reference docs here:
 *
 * https://arcade.makecode.com/reference
 */

// game.onUpdate(() => {
//     // Code in this function will run once per frame. MakeCode
//     // Arcade games run at 30 FPS
//     game.splash("hello");
// });
//=================================================================
const COLOR_WHITE = 1
const COLOR_BLACK = 15
const COLOR_RED = 2
const COLOR_GREEN = 7
const COLOR_BLUE = 8
//===========================class======================================
class CSpriteShow {
    protected m_img: Image[]
    protected m_sp: Sprite
    protected index: number

    constructor() {
        this.index = 0
    }

    public crateSprite() {
        if (this.index == this.m_img.length - 1) {
            this.index = 0
        } else {
            this.index++
        }
        this.m_sp = sprites.createProjectileFromSide(
            // this.m_img[randint(0, this.m_img.length - 1)],
            this.m_img[this.index],
            0,
            50
        )
        // this.m_sp.x = randint(10, 150)
        this.m_sp.x = 20
    }

    public show() {
        game.onUpdateInterval(2000, function () {
            this.crateSprite()
        })
    }
}
//===========================class======================================
class CSpriteSpaceShow extends CSpriteShow {
    constructor() {
        super()
        this.m_img = [
            sprites.space.spaceAsteroid0,
            sprites.space.spaceAsteroid1,
            sprites.space.spaceAsteroid2,
            sprites.space.spaceAsteroid3,
            sprites.space.spaceAsteroid4,

            sprites.space.spaceBlueShip,
            sprites.space.spaceGreenShip,
            sprites.space.spaceOrangeShip,
            sprites.space.spacePinkShip,
            sprites.space.spaceRedShip,

            sprites.space.spaceSmallAsteroid0,
            sprites.space.spaceSmallAsteroid1,
        ]
    }
}
class CSpriteBackgroundShow extends CSpriteShow {
    constructor() {
        super()
        this.m_img = [
            sprites.background.autumn,
            sprites.background.cityscape,
            sprites.background.cityscape2,
            sprites.background.desert,
            sprites.background.forest1,
            sprites.background.forest2,
            sprites.background.fossils,
            sprites.background.lanterns,
        ]
    }
}
//===========================class======================================
class CBackGround {
    constructor() {}

    public scene1() {
        effects.starField.startScreenEffect()
    }
}

class CSpriteRock {
    private m_rockImg: Image[]
    private m_rockSprite: Sprite

    constructor() {
        this.m_rockImg = [
            sprites.space.spaceSmallAsteroid1,
            sprites.space.spaceSmallAsteroid0,
            sprites.space.spaceAsteroid0,
            sprites.space.spaceAsteroid1,
            sprites.space.spaceAsteroid4,
            sprites.space.spaceAsteroid3,
        ]
    }

    public makeRock() {
        this.m_rockSprite = sprites.createProjectileFromSide(
            this.m_rockImg[randint(0, this.m_rockImg.length - 1)],
            0,
            75
        )
        this.m_rockSprite.setKind(SpriteKind.Enemy)
        this.m_rockSprite.x = randint(10, 150)
    }
}
//===========================class======================================
class CSpriteSpaceShip {
    private m_shipSprite: Sprite
    private m_bullet: Sprite

    constructor() {
        this.m_shipSprite = sprites.create(
            sprites.space.spaceRedShip,
            SpriteKind.Player
        )
        this.m_shipSprite.setStayInScreen(true)
        this.m_shipSprite.bottom = 120
    }

    public control() {
        controller.moveSprite(this.m_shipSprite, 100, 100)

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            this.fire()
        })
    }

    public fire() {
        this.m_bullet = sprites.createProjectileFromSprite(
            img`
        . . . . . . . . 
        . . . . . . . . 
        . . . . . . . . 
        . . . . . . . . 
        . . . 7 7 . . . 
        . . . 7 7 . . . 
        . . . 7 7 . . . 
        . . . 7 7 . . . 
        `,
            this.m_shipSprite,
            0,
            -140
        )
        this.m_bullet.startEffect(effects.coolRadial, 100)
    }
}

//===========================class======================================
class CGame {
    protected m_life: number
    constructor() {
        this.m_life = 3
    }

    public init() {}

    public run() {}

    public setLife(lift: number) {
        this.m_life = lift
    }

    protected control() {}

    protected touch() {}

    protected timer() {}
}
//===========================class======================================
class CGameSpaceShip extends CGame {
    private m_bg: CBackGround
    private m_ship_p: CSpriteSpaceShip
    private m_rock_e: CSpriteRock

    constructor() {
        super()
    }

    public init() {
        this.m_bg = new CBackGround()
        this.m_ship_p = new CSpriteSpaceShip()
        this.m_rock_e = new CSpriteRock()
    }

    public run() {
        info.setLife(this.m_life)
        this.m_bg.scene1()

        this.control()
        this.touch()
        this.timer()
    }

    protected control() {
        this.m_ship_p.control()
    }

    protected touch() {
        //bullet hit enemy
        sprites.onOverlap(
            SpriteKind.Projectile,
            SpriteKind.Enemy,
            function (bullet, enemy) {
                bullet.destroy()
                enemy.destroy(effects.disintegrate)
                info.changeScoreBy(1)
            }
        )
        //enemy hit player
        sprites.onOverlap(
            SpriteKind.Player,
            SpriteKind.Enemy,
            function (player, enemy) {
                scene.cameraShake(4, 500)
                enemy.destroy(effects.disintegrate)
                player.startEffect(effects.fire, 200)
                info.changeLifeBy(-1)
            }
        )
    }

    protected timer() {
        game.onUpdateInterval(500, function () {
            this.m_rock_e.makeRock()
        })

        game.onUpdateInterval(100, function () {
            if (controller.A.isPressed()) {
                this.m_ship_p.fire()
            }
        })
    }
}

//===========================class======================================
class CSprite {
    constructor() {}
}
//===========================class======================================
class CSpriteWarrior {
    private m_Img: Image[]
    private m_hero: Sprite
    private m_LF: boolean = false
    constructor() {
        this.m_hero = sprites.create(
            sprites.castle.heroWalkFront1,
            SpriteKind.Player
        )
        
        
        
        
        
    }

    public setStayInScreen(val:boolean = true){
        if (val) {
            this.m_hero.setStayInScreen(true)
            this.m_hero.bottom = 120
        } else {
            this.m_hero.setStayInScreen(false)

            scene.cameraFollowSprite(this.m_hero)
            this.m_hero.setVelocity(0, 50)
            this.m_hero.ay = 300
        }
    }

    public setDirectionLR(val: boolean = true) {
        this.m_LF = val
    }

    public setPosition(x: number, y: number) {
        this.m_hero.setPosition(x, y)
    }

    public controlDirection() {
        game.onUpdate(function () {
            if (controller.right.isPressed()) {
                this.m_hero.x += 2
            } else if (controller.left.isPressed()) {
                this.m_hero.x += -2
            }            
        })
    }

    public contorl() {
        if (this.m_LF) {
            controller.up.onEvent(ControllerButtonEvent.Pressed, function () {                
                this.m_hero.vy += -100
            })
            
            this.controlDirection()
        } else {
            controller.moveSprite(this.m_hero, 100, 100)
            controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
                this.walkUp()
            })
            controller.up.onEvent(ControllerButtonEvent.Released, function () {
                animation.stopAnimation(animation.AnimationTypes.ImageAnimation,this.m_hero)
            })
            controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
                this.walkDown()
            })
            controller.down.onEvent(ControllerButtonEvent.Released, function () {
                animation.stopAnimation(animation.AnimationTypes.ImageAnimation,this.m_hero)
            })
        }

        controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
            this.walkLeft()
        })

        controller.left.onEvent(ControllerButtonEvent.Released, function () {
            animation.stopAnimation(animation.AnimationTypes.ImageAnimation,this.m_hero)
        })

        controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
            this.walkRight()
        })

        controller.right.onEvent(ControllerButtonEvent.Released, function () {
            animation.stopAnimation(animation.AnimationTypes.ImageAnimation,this.m_hero)
        })
        
    }

    public walkUp() {
        animation.runImageAnimation(
            this.m_hero,
            assets.animation`heroWalkUp`,
            200,
            true
        )
    }
    public walkDown() {
        animation.runImageAnimation(
            this.m_hero,
            assets.animation`heroWalkDown`,
            200,
            true
        )
    }
    public walkLeft() {
        animation.runImageAnimation(
            this.m_hero,
            assets.animation`heroWalkLeft`,
            200,
            true
        )
    }
    public walkRight() {
        animation.runImageAnimation(
            this.m_hero,
            assets.animation`heroWalkRight`,
            200,
            true
        )
    }
}
//===========================class======================================
class CGameRPG extends CGame {
    private m_hero: CSpriteWarrior
    constructor() {
        super()
    }

    public init() {
        this.m_hero = new CSpriteWarrior()
        this.m_hero.setStayInScreen()
    }

    public run() {
        this.control()
    }

    protected control(): void {
        this.m_hero.contorl()
    }
}
//===========================class======================================
class CBackGroundMap {
    constructor() {
        scene.setBackgroundColor(13)
        tiles.setCurrentTilemap(assets.tilemap`tileMap`)
    }
}
//===========================class======================================
class CGameTileMaps extends CGame {
    private m_bg: CBackGroundMap
    private m_hero: CSpriteWarrior
    constructor() {
        super()
    }

    public init() {
        this.m_bg = new CBackGroundMap()
        this.m_hero = new CSpriteWarrior()
        this.m_hero.setStayInScreen(false)
        this.m_hero.setPosition(10, 0)
        this.m_hero.setDirectionLR()
    }

    public run() {
        this.control()
    }

    public control() {
        this.m_hero.contorl()
    }
}
//===========================class======================================
//====================function===========================
function testSprite() {
    let sp = new CSpriteSpaceShow()
    // let sp = new CSpriteBackgroundShow()
    sp.show()
}
function runGameSapceShip() {
    let g: CGameSpaceShip = new CGameSpaceShip()
    g.init()
    g.setLife(5)
    g.run()
}

function runGameRPG() {
    let g: CGameRPG = new CGameRPG()
    g.init()
    g.run()
}

function runGameMap() {
    let g: CGameTileMaps = new CGameTileMaps()
    g.init()
    g.run()
}
//================main============================
//================test============================
// testSprite()
//================run============================
// runGameSapceShip()
// runGameRPG()

runGameMap()
