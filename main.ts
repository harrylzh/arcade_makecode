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

        this.control()
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
//===========================================================
class GameApp {
    private m_bg: CBackGround
    private m_ship_p: CSpriteSpaceShip
    private m_rock_e: CSpriteRock
    constructor() {}

    private touch() {
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

    private timer() {
        game.onUpdateInterval(500, function () {
            this.m_rock.makeRock()
        })

        game.onUpdateInterval(100, function () {
            if (controller.A.isPressed()) {
                this.m_ship.fire()
            }
        })
    }

    public run() {
        this.m_bg = new CBackGround()
        this.m_bg.scene1()
        info.setLife(4)

        this.m_ship_p = new CSpriteSpaceShip()
        this.m_rock_e = new CSpriteRock()

        this.touch()
        //=============================================================
        //timer
        this.timer()
    }
}

let g: GameApp = new GameApp()
g.run()
