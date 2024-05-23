namespace SpriteKind {
    export const EnemyProjectile = SpriteKind.create()
    export const PlayerProjectile = SpriteKind.create()
    export const SelectableCharacter = SpriteKind.create()
    export const Background = SpriteKind.create()
    export const SpecialProjectile = SpriteKind.create()
    export const Upgrade = SpriteKind.create()
    export const LifeBar = SpriteKind.create()
    export const EnemyBat = SpriteKind.create()
    export const EnemySkeleton = SpriteKind.create()
    export const EnemyBatProjectile = SpriteKind.create()
    export const EnemyBoss = SpriteKind.create()
    export const EnemyBossProjectile = SpriteKind.create()
    export const EnemySpider = SpriteKind.create()
    export const EnemySpiderProjectile = SpriteKind.create()
    export const EnemyGoblin = SpriteKind.create()
    export const EnemyGoblinProjectile = SpriteKind.create()
    export const EnemyWorm = SpriteKind.create()
    export const ConsumivelVida = SpriteKind.create()
    export const ConsumivelEnergia = SpriteKind.create()
}
namespace StatusBarKind {
    export const Experience = StatusBarKind.create()
    export const BossHealth = StatusBarKind.create()
}
sprites.onOverlap(SpriteKind.EnemyWorm, SpriteKind.EnemyGoblinProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        sprites.destroy(otherSprite, effects.disintegrate, 500)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
function moveSpriteInTime (sprite: Sprite, x: number, y: number, t: number) {
    globalX = x
    globalY = y
    dx = x - sprite.x
    dy = y - sprite.y
    sprite.setVelocity(dx / t, dy / t)
}
sprites.onOverlap(SpriteKind.EnemyGoblinProjectile, SpriteKind.PlayerProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            sprites.destroy(sprite, effects.fountain, 100)
        } else if (_class == "archer") {
            sprites.destroy(sprite, effects.trail, 100)
            sprites.destroy(otherSprite)
        } else if (_class == "mage") {
            sprites.destroy(sprite, effects.fire, 100)
            sprites.destroy(otherSprite)
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.EnemyBatProjectile, SpriteKind.PlayerProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            sprites.destroy(sprite, effects.fountain, 100)
        } else if (_class == "archer") {
            sprites.destroy(sprite, effects.trail, 100)
            sprites.destroy(otherSprite)
        } else if (_class == "mage") {
            sprites.destroy(sprite, effects.fire, 100)
            sprites.destroy(otherSprite)
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.EnemyWorm, SpriteKind.EnemyGoblin, function (sprite, otherSprite) {
    if (_gameRunning) {
        sprites.destroy(otherSprite, effects.disintegrate, 500)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
statusbars.onStatusReached(StatusBarKind.BossHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 75, function (status) {
    preSetBossPosition(128, 50)
})
sprites.onOverlap(SpriteKind.EnemyBat, SpriteKind.SpecialProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -110 * _playerDamageMod
            timer.after(200, function () {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
            })
        } else if (_class == "archer") {
            sprites.destroy(otherSprite)
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
        } else if (_class == "mage") {
            sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -110 * _playerDamageMod
            timer.after(200, function () {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
            })
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
statusbars.onZero(StatusBarKind.BossHealth, function (status) {
    sprites.destroy(boss, effects.ashes, 2000)
    for (let value of sprites.allOfKind(SpriteKind.EnemyBossProjectile)) {
        sprites.destroy(value, effects.ashes, 100)
    }
    sprites.destroy(status)
    bossTime = false
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    timer.after(5000, function () {
        game.setGameOverEffect(true, effects.starField)
        game.gameOver(true)
    })
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    // Checa se está atacando, para poder definir um tempo de recarga entre ataques
    if (!(_attacking)) {
        if (_specialReady) {
            _specialAttacking = true
            _attacking = true
            if (_class == "knight") {
                knightSpecial()
            } else if (_class == "archer") {
                archerSpecial()
            } else if (_class == "mage") {
                mageSpecial()
            }
            _specialCooldown = game.runtime()
            _attacking = false
            _specialReady = false
            _playerEnergy.value = 0
        }
    }
})
statusbars.onZero(StatusBarKind.Health, function (status2) {
    scene.cameraShake(4, 2000)
    music.stopAllSounds()
    music.setVolume(50)
    game.setGameOverMessage(false, "GAME OVER!")
    game.setGameOverPlayable(false, music.melodyPlayable(music.wawawawaa), false)
    game.gameOver(false)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.EnemySpiderProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        _playerHealth.value += -10
        _playerSpeedBase = _playerSpeedBase * 0.5
        controller.moveSprite(_thePlayer, _playerSpeedBase * _playerSpeedMod, _playerSpeedBase * _playerSpeedMod)
        sprites.destroy(otherSprite, effects.trail, 100)
        scene.cameraShake(4, 200)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
    timer.after(750, function () {
        _playerSpeedBase = _playerSpeedBase / 0.5
        controller.moveSprite(_thePlayer, _playerSpeedBase * _playerSpeedMod, _playerSpeedBase * _playerSpeedMod)
    })
})
sprites.onOverlap(SpriteKind.EnemyBoss, SpriteKind.PlayerProjectile, function (sprite, otherSprite) {
    if (started) {
        if (_gameRunning) {
            if (_class == "knight") {
                if (_WeaponUpgraded) {
                    sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
                    _bossHealthBar.value += -110 * _playerDamageMod
                    timer.after(300, function () {
                        sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
                    })
                }
            } else if (_class == "archer") {
                if (_WeaponUpgraded) {
                    sprites.destroy(otherSprite)
                    _bossHealthBar.value += -55 * _playerDamageMod
                }
            } else if (_class == "mage") {
                if (_WeaponUpgraded) {
                    sprites.destroy(otherSprite)
                    _bossHealthBar.value += -55 * _playerDamageMod
                }
            }
            music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
        }
    }
})
function spell1 () {
    enemyShootAimingPlayer(boss, 90, 5)
}
sprites.onOverlap(SpriteKind.EnemyWorm, SpriteKind.EnemySkeleton, function (sprite, otherSprite) {
    if (_gameRunning) {
        sprites.destroy(otherSprite, effects.disintegrate, 500)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
function moveSpriteRandom (sprite: Sprite, yLowerBound: number, outerBound: number, v: number) {
    moveSprite(sprite, randint(outerBound, scene.screenWidth() - outerBound), randint(outerBound, yLowerBound), v)
}
sprites.onOverlap(SpriteKind.EnemySpider, SpriteKind.Player, function (sprite, otherSprite) {
    if (_gameRunning) {
        _playerHealth.value += -5
        sprites.destroy(sprite, effects.disintegrate, 100)
        scene.cameraShake(4, 200)
        music.play(music.melodyPlayable(music.knock), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.EnemyWorm, SpriteKind.SpecialProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        sprites.destroy(otherSprite)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.EnemyBat, SpriteKind.Player, function (sprite, otherSprite) {
    if (_gameRunning) {
        _playerHealth.value += -5
        sprites.destroy(sprite, effects.disintegrate, 100)
        scene.cameraShake(4, 200)
        music.play(music.melodyPlayable(music.knock), music.PlaybackMode.InBackground)
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (_showCharScreen) {
        scene.setBackgroundImage(assets.image`black`)
        _thePlayer = sprites.readDataSprite(_currentSelectedCharacter, "player")
        _playerHealth = statusbars.create(50, 6, StatusBarKind.Health)
        _playerHealth.setColor(7, 2)
        _playerHealth.setLabel("HP", 15)
        _playerHealth.positionDirection(CollisionDirection.Bottom)
        _playerHealth.setOffsetPadding(-35, 15)
        _playerHealth.setBarBorder(1, 1)
        _playerEnergy = statusbars.create(50, 6, StatusBarKind.Energy)
        _playerEnergy.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
        _playerEnergy.setColor(8, 13, 13)
        _playerEnergy.setLabel("MP", 15)
        _playerEnergy.positionDirection(CollisionDirection.Bottom)
        _playerEnergy.setOffsetPadding(35, 15)
        _playerEnergy.setBarBorder(1, 1)
        // special cooldown
        _playerEnergy.max = 30
        _playerEnergy.value = 0
        _playerExperience = statusbars.create(100, 4, StatusBarKind.Experience)
        _playerExperience.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
        _playerExperience.setColor(5, 13, 13)
        _playerExperience.setLabel("EXP", 15)
        _playerExperience.positionDirection(CollisionDirection.Bottom)
        _playerExperience.setOffsetPadding(0, 5)
        _playerExperience.setBarBorder(1, 1)
        _playerExperience.max = 15
        _playerExperience.value = 0
        if (_currentCharacterIndex == 0) {
            _class = "knight"
            _playerHealth.max = 100
            _playerEnergy.value = 0
            _playerSpeedBase = 70
            _smallKnight.setImage(assets.image`smallKnight`)
            animation.runImageAnimation(
            _smallKnight,
            assets.animation`smallKnightAnim`,
            200,
            true
            )
        } else if (_currentCharacterIndex == 1) {
            _class = "archer"
            _playerHealth.max = 80
            _playerSpeedBase = 90
            _smallArcher.setImage(assets.image`smallArcher`)
            animation.runImageAnimation(
            _smallArcher,
            assets.animation`smallArcherAnim`,
            200,
            true
            )
        } else if (_currentCharacterIndex == 2) {
            _class = "mage"
            _playerHealth.max = 70
            _playerSpeedBase = 70
            _smallMage.setImage(assets.image`smallMage`)
            animation.runImageAnimation(
            _smallMage,
            assets.animation`smallMageAnim`,
            200,
            true
            )
        }
        _thePlayer.setFlag(SpriteFlag.Invisible, false)
        _thePlayer.setPosition(80, 105)
        _thePlayer.setStayInScreen(true)
        for (let value of sprites.allOfKind(SpriteKind.SelectableCharacter)) {
            sprites.destroy(value)
        }
        for (let value of sprites.allOfKind(SpriteKind.Background)) {
            sprites.destroy(value)
        }
        for (let value of sprites.allOfKind(SpriteKind.Text)) {
            sprites.destroy(value)
        }
        music.setVolume(20)
        music.stopAllSounds()
        music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
        color.startFade(color.originalPalette, color.Black, 1000)
        pause(1000)
        _showCharScreen = false
        tiles.setCurrentTilemap(tilemap`level0`)
        _thePlayer.setPosition(scene.screenWidth() / 2 * 1, scene.screenHeight() / 1.1 * 1)
        color.startFade(color.Black, color.originalPalette, 1000)
        music.play(music.createSong(assets.song`level1song`), music.PlaybackMode.LoopingInBackground)
        music.setVolume(255)
        controller.moveSprite(_thePlayer, _playerSpeedBase, _playerSpeedBase)
        _gameRunning = true
    } else if (_showUpgradeScreen) {
        if (_currentCharacterIndex == 0) {
            _playerDamageMod += 0.15
        } else if (_currentCharacterIndex == 1) {
            _playerSpeedMod += 0.1
            controller.moveSprite(_thePlayer, _playerSpeedBase * _playerSpeedMod, _playerSpeedBase * _playerSpeedMod)
        } else if (_currentCharacterIndex == 2) {
            if (_stage == 1) {
                _playerHealth.max += _playerHealth.max * 0.1
                _playerHealth.value += _playerHealth.value * 0.5
            }
        }
        for (let value of sprites.allOfKind(SpriteKind.Upgrade)) {
            sprites.destroy(value)
        }
        for (let value of sprites.allOfKind(SpriteKind.Background)) {
            sprites.destroy(value)
        }
        for (let value of sprites.allOfKind(SpriteKind.Text)) {
            sprites.destroy(value)
        }
        unfreeze()
        _thePlayer.setFlag(SpriteFlag.GhostThroughSprites, true)
        timer.after(1000, function () {
            _thePlayer.setFlag(SpriteFlag.GhostThroughSprites, false)
        })
        _showUpgradeScreen = false
    } else if (!(_attacking)) {
        _attacking = true
        if (_class == "knight") {
            if (_WeaponUpgraded) {
                if (game.runtime() - _attackCooldown >= 500) {
                    knightSAttack()
                    _attackCooldown = game.runtime()
                }
            } else if (game.runtime() - _attackCooldown >= 750) {
                knightAttack()
                _attackCooldown = game.runtime()
            }
        } else if (_class == "archer") {
            if (_WeaponUpgraded) {
                if (game.runtime() - _attackCooldown >= 500) {
                    archerSAttack()
                    _attackCooldown = game.runtime()
                }
            } else if (game.runtime() - _attackCooldown >= 1000) {
                archerAttack()
                _attackCooldown = game.runtime()
            }
        } else if (_class == "mage") {
            if (_WeaponUpgraded) {
                if (game.runtime() - _attackCooldown >= 350) {
                    mageSAttack()
                    _attackCooldown = game.runtime()
                }
            } else if (game.runtime() - _attackCooldown >= 350) {
                mageAttack()
                _attackCooldown = game.runtime()
            }
        }
        _attacking = false
    }
})
sprites.onOverlap(SpriteKind.EnemyBat, SpriteKind.PlayerProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            if (_WeaponUpgraded) {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
                timer.after(100, function () {
                    sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
                })
            } else {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
                timer.after(100, function () {
                    sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
                })
            }
        } else if (_class == "archer") {
            if (_WeaponUpgraded) {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
            } else {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
            }
        } else if (_class == "mage") {
            if (_WeaponUpgraded) {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
            } else {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -27.5 * _playerDamageMod
            }
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.ConsumivelEnergia, function (sprite, otherSprite) {
    if (_gameRunning) {
        _playerEnergy.value += 10
        sprites.destroy(otherSprite, effects.fire, 500)
    }
})
sprites.onOverlap(SpriteKind.EnemyBoss, SpriteKind.SpecialProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
            _bossHealthBar.value += -110 * _playerDamageMod
            timer.after(300, function () {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
            })
        } else if (_class == "archer") {
            sprites.destroy(otherSprite)
            _bossHealthBar.value += -55 * _playerDamageMod
        } else if (_class == "mage") {
            sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
            _bossHealthBar.value += -110 * _playerDamageMod
            timer.after(150, function () {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
            })
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.ConsumivelVida, function (sprite, otherSprite) {
    if (_gameRunning) {
        _playerHealth.value += 10
        sprites.destroy(otherSprite, effects.fire, 500)
    }
})
function knightSpecial () {
    music.play(music.createSoundEffect(WaveShape.Noise, 4614, 1, 255, 0, 1000, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    pause(1000)
    music.play(music.createSoundEffect(WaveShape.Noise, 1663, 4873, 255, 0, 1000, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    _specialWeapon = sprites.create(assets.image`empty64`, SpriteKind.PlayerProjectile)
    animation.runImageAnimation(
    _specialWeapon,
    assets.animation`specialSwordAnimation`,
    200,
    false
    )
    _specialWeapon.setKind(SpriteKind.SpecialProjectile)
    scaling.scaleToPercent(_specialWeapon, 100, ScaleDirection.Uniformly, ScaleAnchor.Middle)
}
function nonSpell1 () {
    for (let index = 0; index <= MAX - 1; index++) {
        shootBulletFromSprite(boss, 60, 360 / MAX * index + offset)
    }
}
sprites.onOverlap(SpriteKind.EnemyWorm, SpriteKind.PlayerProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        scene.cameraShake(4, 200)
        sprites.destroy(otherSprite)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (_showCharScreen || _showUpgradeScreen) {
        _currentCharacterIndex = (_currentCharacterIndex + (_ourCharacters.length - 1)) % _ourCharacters.length
    }
})
function knightAttack () {
    music.play(music.createSoundEffect(WaveShape.Noise, 1663, 4873, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    _weapon = sprites.create(assets.image`knightAttack`, SpriteKind.PlayerProjectile)
    _weapon.setFlag(SpriteFlag.GhostThroughSprites, false)
    pause(100)
    _weapon.setImage(assets.image`empty`)
}
sprites.onOverlap(SpriteKind.EnemySpider, SpriteKind.PlayerProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            if (_WeaponUpgraded) {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
                timer.after(100, function () {
                    sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
                })
            } else {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
                timer.after(100, function () {
                    sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
                })
            }
        } else if (_class == "archer") {
            if (_WeaponUpgraded) {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
            } else {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
            }
        } else if (_class == "mage") {
            if (_WeaponUpgraded) {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
            } else {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -27.5 * _playerDamageMod
            }
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.EnemyWorm, SpriteKind.EnemySpiderProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        sprites.destroy(otherSprite, effects.disintegrate, 500)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
function levelUp () {
    scene.centerCameraAt(scene.screenWidth() / 2, scene.screenHeight() / 2)
    _showUpgradeScreen = true
    _textSprite = textsprite.create("Escolha uma melhoria", 0, 1)
    _textSprite.z = 101
    _textSprite.setMaxFontHeight(10)
    _textSprite.setPosition(scene.screenWidth() / 2 * 1, scene.screenHeight() / 5 * 1)
    _textSprite.setOutline(2, 15)
    _upgrade1 = sprites.create(assets.image`upgrade1`, SpriteKind.Upgrade)
    _upgrade1.z = 101
    _upgrade1.setPosition(scene.screenWidth() / 12 * 2, scene.screenHeight() / 2 * 1)
    _upgrade1desc = textsprite.create("poder", 0, 1)
    _upgrade1desc.setOutline(1, 15)
    _upgrade1desc.z = 101
    _upgrade1desc.setMaxFontHeight(10)
    _upgrade1desc.setPosition(_upgrade1.x, _upgrade1.bottom + 20)
    _upgrade2 = sprites.create(assets.image`upgrade2`, SpriteKind.Upgrade)
    _upgrade2.z = 101
    _upgrade2.setPosition(scene.screenWidth() / 12 * 6, scene.screenHeight() / 2 * 1)
    _upgrade2desc = textsprite.create("rapidez", 0, 1)
    _upgrade2desc.setOutline(1, 15)
    _upgrade2desc.z = 101
    _upgrade2desc.setMaxFontHeight(10)
    _upgrade2desc.setPosition(_upgrade2.x, _upgrade2.bottom + 20)
    _upgrade3 = sprites.create(assets.image`upgrade3`, SpriteKind.Upgrade)
    _upgrade3.z = 101
    _upgrade3.setPosition(scene.screenWidth() / 12 * 10, scene.screenHeight() / 2 * 1)
    _upgrade3desc = textsprite.create("vida", 0, 1)
    _upgrade3desc.setOutline(1, 15)
    _upgrade3desc.z = 101
    _upgrade3desc.setMaxFontHeight(10)
    _upgrade3desc.setPosition(_upgrade3.x, _upgrade3.bottom + 20)
    _ourCharacters = [_upgrade1, _upgrade2, _upgrade3]
    _currentCharacterIndex = 1
    _characterSelectorBox = sprites.create(assets.image`selector`, SpriteKind.Background)
    _characterSelectorBox.z = 101
}
function archerSAttack () {
    music.play(music.createSoundEffect(WaveShape.Noise, 196, 2737, 182, 0, 150, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    music.play(music.createSoundEffect(WaveShape.Sawtooth, 368, 1, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    _weapon = sprites.createProjectileFromSprite(assets.image`archerSAttack`, _thePlayer, 0, -200)
    _weapon.setKind(SpriteKind.PlayerProjectile)
    _weapon.setFlag(SpriteFlag.AutoDestroy, true)
}
function spell2 () {
    for (let index = 0; index <= 4; index++) {
        shootBulletFromSprite(boss, 60, offset + index * 30)
        offset += 23
    }
}
function mageAttack () {
    music.play(music.createSoundEffect(WaveShape.Triangle, 1, 1935, 255, 0, 80, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    _weapon = sprites.createProjectileFromSprite(assets.image`mageAttack`, _thePlayer, 0, -80)
    _weapon.setKind(SpriteKind.PlayerProjectile)
    _weapon.setFlag(SpriteFlag.AutoDestroy, true)
}
sprites.onOverlap(SpriteKind.EnemySkeleton, SpriteKind.SpecialProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -110 * _playerDamageMod
            timer.after(200, function () {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
            })
        } else if (_class == "archer") {
            sprites.destroy(otherSprite)
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
        } else if (_class == "mage") {
            sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -110 * _playerDamageMod
            timer.after(200, function () {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
            })
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
statusbars.onZero(StatusBarKind.EnemyHealth, function (status) {
    if (_gameRunning) {
        _playerExperience.value += 1
        sprites.destroy(status.spriteAttachedTo(), effects.disintegrate, 100)
        info.changeScoreBy(1)
    }
})
function mageSpecial () {
    music.play(music.createSoundEffect(WaveShape.Noise, 1, 5000, 255, 0, 500, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    pause(1000)
    music.play(music.createSoundEffect(WaveShape.Sawtooth, 644, 2082, 255, 0, 381, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    _specialWeapon = sprites.createProjectileFromSprite(assets.image`fireball`, _thePlayer, 0, -100)
    scaling.scaleToPercent(_specialWeapon, 200, ScaleDirection.Uniformly, ScaleAnchor.Middle)
    _specialWeapon.setKind(SpriteKind.SpecialProjectile)
    _specialWeapon.setFlag(SpriteFlag.AutoDestroy, true)
}
sprites.onOverlap(SpriteKind.EnemyGoblin, SpriteKind.PlayerProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            if (_WeaponUpgraded) {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
                timer.after(100, function () {
                    sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
                })
            } else {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
                timer.after(100, function () {
                    sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
                })
            }
        } else if (_class == "archer") {
            if (_WeaponUpgraded) {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
            } else {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
            }
        } else if (_class == "mage") {
            if (_WeaponUpgraded) {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
            } else {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -27.5 * _playerDamageMod
            }
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
function summonSpider () {
    _enemySpiderHealthbar = statusbars.create(20, 3, StatusBarKind.EnemyHealth)
    _enemySpiderHealthbar.setColor(7, 2, 3)
    _enemySpiderHealthbar.setBarBorder(1, 14)
    _enemySpider = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.EnemySpider)
    animation.runImageAnimation(
    _enemySpider,
    assets.animation`myAnim4`,
    200,
    true
    )
    _enemySpiderHealthbar.attachToSprite(_enemySpider)
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, _enemySpider).max = 100 * _enemyHealthMod
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, _enemySpider).value = 100 * _enemyHealthMod
    _enemySpider.setPosition(randint(scene.screenWidth() * 0.15, scene.screenWidth() * 0.85), 30)
    _enemySpider.setVelocity([-15 * _EnemySpeedMod, 15 * _EnemySpeedMod]._pickRandom(), 3 * _EnemySpeedMod)
    _enemySpider.setFlag(SpriteFlag.BounceOnWall, true)
    _enemySpider.setFlag(SpriteFlag.AutoDestroy, true)
    pause(_enemySpiderSummonCD)
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (_showCharScreen || _showUpgradeScreen) {
        _currentCharacterIndex = (_currentCharacterIndex + 1) % _ourCharacters.length
    }
})
sprites.onOverlap(SpriteKind.EnemyGoblin, SpriteKind.SpecialProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -110 * _playerDamageMod
            timer.after(200, function () {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
            })
        } else if (_class == "archer") {
            sprites.destroy(otherSprite)
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
        } else if (_class == "mage") {
            sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -110 * _playerDamageMod
            timer.after(200, function () {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
            })
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.EnemySkeleton, SpriteKind.PlayerProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            if (_WeaponUpgraded) {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
                timer.after(100, function () {
                    sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
                })
            } else {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
                timer.after(100, function () {
                    sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
                })
            }
        } else if (_class == "archer") {
            if (_WeaponUpgraded) {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
            } else {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
            }
        } else if (_class == "mage") {
            if (_WeaponUpgraded) {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
            } else {
                sprites.destroy(otherSprite)
                statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -27.5 * _playerDamageMod
            }
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.EnemyBatProjectile, SpriteKind.SpecialProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            sprites.destroy(sprite, effects.fountain, 100)
        } else if (_class == "archer") {
            sprites.destroy(sprite, effects.trail, 100)
        } else if (_class == "mage") {
            sprites.destroy(sprite, effects.fire, 100)
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.EnemySkeleton, SpriteKind.Player, function (sprite, otherSprite) {
    if (true) {
        _playerHealth.value += -10
        sprites.destroy(sprite, effects.disintegrate, 100)
        scene.cameraShake(4, 200)
        music.play(music.melodyPlayable(music.knock), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.EnemyGoblin, SpriteKind.Player, function (sprite, otherSprite) {
    if (_gameRunning) {
        _playerHealth.value += -10
        sprites.destroy(sprite, effects.disintegrate, 100)
        scene.cameraShake(4, 200)
        music.play(music.melodyPlayable(music.knock), music.PlaybackMode.InBackground)
    }
})
function summonGoblin () {
    _enemyGoblinHealthbar = statusbars.create(20, 3, StatusBarKind.EnemyHealth)
    _enemyGoblinHealthbar.setColor(7, 2, 3)
    _enemyGoblinHealthbar.setBarBorder(1, 14)
    _enemyGoblin = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.EnemyGoblin)
    animation.runImageAnimation(
    _enemyGoblin,
    assets.animation`goblinAnimation`,
    200,
    true
    )
    _enemyGoblinHealthbar.attachToSprite(_enemyGoblin)
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, _enemyGoblin).max = 100 * _enemyHealthMod
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, _enemyGoblin).value = 100 * _enemyHealthMod
    _enemyGoblin.setFlag(SpriteFlag.BounceOnWall, true)
    _enemyGoblin.setPosition(randint(scene.screenWidth() * 0.15, scene.screenWidth() * 0.85), 30)
    _enemyGoblin.setVelocity([-30 * _EnemySpeedMod, 30 * _EnemySpeedMod]._pickRandom(), 0)
    _enemyGoblin.setFlag(SpriteFlag.AutoDestroy, true)
    pause(_enemyGoblinSummonCD)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.EnemyBatProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        _playerHealth.value += -10
        sprites.destroy(otherSprite, effects.trail, 100)
        scene.cameraShake(4, 200)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
function characterSelection () {
    scene.centerCameraAt(scene.screenWidth() / 2, scene.screenHeight() / 2)
    for (let value of sprites.allOfKind(SpriteKind.Player)) {
        value.setFlag(SpriteFlag.Invisible, true)
    }
    _showCharScreen = true
    _textSprite = textsprite.create("Escolha seu personagem", 0, 1)
    _textSprite.z = 101
    _textSprite.setMaxFontHeight(10)
    scaling.scaleByPercent(_textSprite, -10, ScaleDirection.Uniformly, ScaleAnchor.Middle)
    _textSprite.setPosition(scene.screenWidth() / 2 * 1, scene.screenHeight() / 100 * 15)
    _textSprite.setOutline(2, 15)
    _knightClass = sprites.create(assets.image`knight`, SpriteKind.SelectableCharacter)
    _knightClass.z = 101
    _knightClass.setPosition(scene.screenWidth() / 100 * 20, scene.screenHeight() / 100 * 39)
    sprites.setDataSprite(_knightClass, "player", _smallKnight)
    _knightTitle = textsprite.create("Arthur", 0, 1)
    _knightTitle.setOutline(1, 15)
    _knightTitle.z = 101
    _knightTitle.setMaxFontHeight(10)
    _knightTitle.setPosition(_knightClass.x, _knightClass.bottom + 20)
    _archerClass = sprites.create(assets.image`archer`, SpriteKind.SelectableCharacter)
    _archerClass.z = 101
    _archerClass.setPosition(scene.screenWidth() / 100 * 50, scene.screenHeight() / 100 * 39)
    sprites.setDataSprite(_archerClass, "player", _smallArcher)
    _archerTitle = textsprite.create("Pablo", 0, 1)
    _archerTitle.setOutline(1, 15)
    _archerTitle.z = 101
    _archerTitle.setMaxFontHeight(10)
    _archerTitle.setPosition(_archerClass.x, _archerClass.bottom + 20)
    _mageClass = sprites.create(assets.image`mage`, SpriteKind.SelectableCharacter)
    _mageClass.z = 101
    _mageClass.setPosition(scene.screenWidth() / 100 * 82, scene.screenHeight() / 100 * 39)
    sprites.setDataSprite(_mageClass, "player", _smallMage)
    _mageTitle = textsprite.create("Rafael", 0, 1)
    _mageTitle.setOutline(1, 15)
    _mageTitle.z = 101
    _mageTitle.setMaxFontHeight(10)
    _mageTitle.setPosition(_mageClass.x, _mageClass.bottom + 20)
    _ourCharacters = [_knightClass, _archerClass, _mageClass]
    _currentCharacterIndex = 1
    _characterSelectorBox = sprites.create(assets.image`selector`, SpriteKind.Background)
    _characterSelectorBox.z = 101
}
sprites.onOverlap(SpriteKind.EnemyWorm, SpriteKind.Player, function (sprite, otherSprite) {
    if (_gameRunning) {
        _playerHealth.value += -30
        sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
        timer.after(500, function () {
            sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
        })
        scene.cameraShake(4, 200)
        music.play(music.melodyPlayable(music.knock), music.PlaybackMode.InBackground)
    }
})
statusbars.onStatusReached(StatusBarKind.BossHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 25, function (status) {
    preSetBossPosition(128, 50)
})
function mageSAttack () {
    music.play(music.createSoundEffect(WaveShape.Triangle, 1166, 1, 255, 0, 130, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    _weapon = sprites.createProjectileFromSprite(assets.image`mageAttackS`, _thePlayer, 0, -120)
    _weapon.setKind(SpriteKind.PlayerProjectile)
    _weapon.setFlag(SpriteFlag.AutoDestroy, true)
}
function Intro () {
    music.play(music.createSong(assets.song`menu_song`), music.PlaybackMode.LoopingInBackground)
    introScroll()
    _pressToStart = textsprite.create("Aperte qualquer botão para iniciar", 0, 1)
    _pressToStart.setPosition(scene.screenWidth() / 2, scene.screenHeight() / 1.1)
    scaling.scaleToPercent(_pressToStart, 120, ScaleDirection.Uniformly, ScaleAnchor.Middle)
    _pressToStart.setOutline(1, 15)
    pauseUntil(() => controller.anyButton.isPressed())
    sprites.destroy(_animatedTower)
    scaling.scaleToPercent(_pressToStart, 0, ScaleDirection.Uniformly, ScaleAnchor.Middle)
    music.stopAllSounds()
    music.play(music.melodyPlayable(music.spooky), music.PlaybackMode.InBackground)
    color.startFade(color.originalPalette, color.Black, 1000)
    pause(1000)
    scene.setBackgroundImage(assets.image`howtoplay`)
    color.startFade(color.Black, color.originalPalette, 1000)
    pause(1000)
    pauseUntil(() => controller.anyButton.isPressed())
    music.play(music.melodyPlayable(music.spooky), music.PlaybackMode.InBackground)
    color.startFade(color.originalPalette, color.Black, 1000)
    pause(1000)
    timer.after(1000, function () {
        color.startFade(color.Black, color.originalPalette, 1000)
        pause(1000)
    })
}
sprites.onOverlap(SpriteKind.EnemySpider, SpriteKind.SpecialProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -110 * _playerDamageMod
            timer.after(200, function () {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
            })
        } else if (_class == "archer") {
            sprites.destroy(otherSprite)
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -55 * _playerDamageMod
        } else if (_class == "mage") {
            sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite).value += -110 * _playerDamageMod
            timer.after(200, function () {
                sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
            })
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
function introScroll () {
    scene.setBackgroundImage(assets.image`intro0`)
    scroller.scrollBackgroundWithSpeed(0, -32)
    pause(8000)
    scene.setBackgroundImage(assets.image`intro1`)
    scroller.scrollBackgroundWithSpeed(0, -32)
    pause(8000)
    scene.setBackgroundImage(assets.image`intro2`)
    scroller.scrollBackgroundWithSpeed(0, -32)
    pause(8000)
    scene.setBackgroundImage(assets.image`intro3`)
    scroller.scrollBackgroundWithSpeed(0, -32)
    pause(8000)
    scene.setBackgroundImage(assets.image`menu-bg0`)
    scroller.scrollBackgroundWithSpeed(0, -32)
    pause(8000)
    scroller.scrollBackgroundWithSpeed(0, 0)
    _animatedTower = sprites.create(assets.image`empty256`, SpriteKind.Background)
    animation.runImageAnimation(
    _animatedTower,
    assets.animation`myAnim0`,
    100,
    true
    )
    pause(2000)
}
function preSetBossPosition (x: number, y: number) {
    started = false
    ready = false
    offset = 0
    moveSpriteInTime(boss, x, y, 3)
}
function summonBat () {
    _enemyBatHealthBar = statusbars.create(20, 3, StatusBarKind.EnemyHealth)
    _enemyBatHealthBar.setColor(7, 2, 3)
    _enemyBatHealthBar.setBarBorder(1, 14)
    _enemyBat = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.EnemyBat)
    animation.runImageAnimation(
    _enemyBat,
    assets.animation`myAnim7`,
    200,
    true
    )
    _enemyBatHealthBar.attachToSprite(_enemyBat)
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, _enemyBat).max = 100 * _enemyHealthMod
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, _enemyBat).value = 100 * _enemyHealthMod
    _enemyBat.setFlag(SpriteFlag.BounceOnWall, true)
    _enemyBat.setPosition(randint(scene.screenWidth() * 0.15, scene.screenWidth() * 0.85), 30)
    _enemyBat.setVelocity([-25, 25]._pickRandom(), 5 * _EnemySpeedMod)
    _enemyBat.setFlag(SpriteFlag.AutoDestroy, true)
    pause(_enemyBatSummonCD)
}
function moveSpriteRandomFixedTime (sprite: Sprite, yLowerBound: number, outerBound: number, t: number) {
    moveSpriteInTime(sprite, randint(outerBound, scene.screenWidth() - outerBound), randint(outerBound, yLowerBound), t)
}
statusbars.onStatusReached(StatusBarKind.BossHealth, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 50, function (status) {
    preSetBossPosition(128, 50)
})
function summonSkeleton () {
    _enemySkeletonHealthBar = statusbars.create(20, 3, StatusBarKind.EnemyHealth)
    _enemySkeletonHealthBar.setColor(7, 2, 3)
    _enemySkeletonHealthBar.setBarBorder(1, 14)
    _enemySkeleton = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.EnemySkeleton)
    animation.runImageAnimation(
    _enemySkeleton,
    assets.animation`myAnim2`,
    200,
    true
    )
    _enemySkeletonHealthBar.attachToSprite(_enemySkeleton)
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, _enemySkeleton).max = 50 * _enemyHealthMod
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, _enemySkeleton).value = 50 * _enemyHealthMod
    _enemySkeleton.setPosition(randint(scene.screenWidth() * 0.15, scene.screenWidth() * 0.85), randint(30, 45))
    _enemySkeleton.follow(_thePlayer, _enemySkeletonSpeedBase * _EnemySpeedMod)
    _enemySkeleton.setFlag(SpriteFlag.AutoDestroy, true)
    _enemySkeleton.setFlag(SpriteFlag.GhostThroughWalls, true)
    pause(_enemySkeletonSummonCD)
}
sprites.onOverlap(SpriteKind.EnemySpiderProjectile, SpriteKind.PlayerProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            sprites.destroy(sprite, effects.fountain, 100)
        } else if (_class == "archer") {
            sprites.destroy(sprite, effects.trail, 100)
            sprites.destroy(otherSprite)
        } else if (_class == "mage") {
            sprites.destroy(sprite, effects.fire, 100)
            sprites.destroy(otherSprite)
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
function summonWorm () {
    scene.cameraShake(4, 1000)
    music.play(music.createSoundEffect(WaveShape.Triangle, 1, 1, 255, 255, 3000, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    _enemyWorm = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.EnemyWorm)
    _randomWorm = randint(0, 1)
    _enemyWorm.setFlag(SpriteFlag.AutoDestroy, true)
    _enemyWorm.setFlag(SpriteFlag.GhostThroughWalls, true)
    if (_randomWorm == 0) {
        animation.runImageAnimation(
        _enemyWorm,
        assets.animation`enemyBurnAnim0`,
        200,
        true
        )
        _enemyWorm.setPosition(0, 0)
        _enemyWorm.setVelocity(scene.screenWidth() / 2, scene.screenHeight() / 2)
    } else {
        animation.runImageAnimation(
        _enemyWorm,
        assets.animation`enemyBurnAnim0`,
        200,
        true
        )
        _enemyWorm.setPosition(scene.screenWidth(), 0)
        _enemyWorm.setVelocity(scene.screenWidth() / -2, scene.screenHeight() / 2)
    }
    pause(_enemyWormSummonCD)
}
function archerAttack () {
    music.play(music.createSoundEffect(WaveShape.Noise, 196, 2737, 182, 0, 150, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    music.play(music.createSoundEffect(WaveShape.Square, 848, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    _weapon = sprites.createProjectileFromSprite(assets.image`archerAttack`, _thePlayer, 0, -120)
    _weapon.setKind(SpriteKind.PlayerProjectile)
    _weapon.setFlag(SpriteFlag.AutoDestroy, true)
}
function nonSpell2 () {
    for (let index = 0; index <= MAX - 1; index++) {
        shootBulletFromSprite(boss, 60, 360 / MAX * index + offset)
        shootBulletFromSprite(boss, 100, 360 / MAX * index + offset)
    }
}
function archerSpecialArrow () {
    music.play(music.createSoundEffect(WaveShape.Noise, 196, 2737, 182, 0, 150, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    music.play(music.createSoundEffect(WaveShape.Square, 848, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    _specialWeapon = sprites.createProjectileFromSprite(assets.image`arrowSpecial`, _thePlayer, 0, -100)
    _specialWeapon.setKind(SpriteKind.SpecialProjectile)
    _specialWeapon.setFlag(SpriteFlag.AutoDestroy, true)
}
sprites.onOverlap(SpriteKind.EnemySpiderProjectile, SpriteKind.SpecialProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        if (_class == "knight") {
            sprites.destroy(sprite, effects.fountain, 100)
        } else if (_class == "archer") {
            sprites.destroy(sprite, effects.trail, 100)
        } else if (_class == "mage") {
            sprites.destroy(sprite, effects.fire, 100)
        }
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.EnemyWorm, SpriteKind.EnemyBat, function (sprite, otherSprite) {
    if (_gameRunning) {
        sprites.destroy(otherSprite, effects.disintegrate, 500)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
function knightSAttack () {
    music.play(music.createSoundEffect(WaveShape.Noise, 3189, 334, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    _weapon = sprites.create(assets.image`knightSAttack`, SpriteKind.PlayerProjectile)
    _weapon.setFlag(SpriteFlag.GhostThroughSprites, false)
    music.play(music.createSoundEffect(WaveShape.Sawtooth, 363, 1432, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    _knightRanged = sprites.createProjectileFromSprite(assets.image`KnightSpecial`, _thePlayer, 0, -150)
    _knightRanged.setKind(SpriteKind.PlayerProjectile)
    pause(150)
    _weapon.setImage(assets.image`empty`)
}
function unfreeze () {
    _gameRunning = true
    _playerSpeedBase = _playerSpeedBase * 100000
    controller.moveSprite(_thePlayer, _playerSpeedBase * _playerSpeedMod, _playerSpeedBase * _playerSpeedMod)
    for (let value of sprites.allOfKind(SpriteKind.EnemyWorm)) {
        value.vx = sprites.readDataNumber(value, "vx")
        value.vy = sprites.readDataNumber(value, "vy")
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemyGoblin)) {
        value.vx = sprites.readDataNumber(value, "vx")
        value.vy = sprites.readDataNumber(value, "vy")
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemyGoblinProjectile)) {
        value.vx = sprites.readDataNumber(value, "vx")
        value.vy = sprites.readDataNumber(value, "vy")
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemySpiderProjectile)) {
        value.vx = sprites.readDataNumber(value, "vx")
        value.vy = sprites.readDataNumber(value, "vy")
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemySpider)) {
        value.vx = sprites.readDataNumber(value, "vx")
        value.vy = sprites.readDataNumber(value, "vy")
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemyBat)) {
        value.vx = sprites.readDataNumber(value, "vx")
        value.vy = sprites.readDataNumber(value, "vy")
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemySkeleton)) {
        value.follow(_thePlayer, _enemySkeletonSpeedBase * _EnemySpeedMod)
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemyBatProjectile)) {
        value.vx = sprites.readDataNumber(value, "vx")
        value.vy = sprites.readDataNumber(value, "vy")
    }
    for (let value of sprites.allOfKind(SpriteKind.PlayerProjectile)) {
        value.vx = sprites.readDataNumber(value, "vx")
        value.vy = sprites.readDataNumber(value, "vy")
    }
    for (let value of sprites.allOfKind(SpriteKind.SpecialProjectile)) {
        value.vx = sprites.readDataNumber(value, "vx")
        value.vy = sprites.readDataNumber(value, "vy")
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.EnemyBossProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        _playerHealth.value += -5
        sprites.destroy(otherSprite, effects.trail, 100)
        scene.cameraShake(4, 200)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
function shootBulletFromSprite (sourceSprite: Sprite, speed: number, angle: number) {
    _bossProjectile = sprites.createProjectileFromSprite(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, sourceSprite, speed * Math.cos(angle / 57.3), speed * Math.sin(angle / 57.3))
    _bossProjectile.setKind(SpriteKind.EnemyBossProjectile)
    _bossProjectile.setFlag(SpriteFlag.AutoDestroy, true)
    _bossProjectile.setImage(assets.image`bossProjectile`)
}
function moveSprite (sprite: Sprite, x: number, y: number, v: number) {
    globalX = x
    globalY = y
    dx = x - sprite.x
    dy = y - sprite.y
    speed = Math.sqrt(dx * dx + dy * dy)
    if (speed != 0) {
        sprite.setVelocity(dx / speed * v, dy / speed * v)
    }
}
spriteutils.createRenderable(100, function (screen2) {
    if (_showUpgradeScreen) {
        _currentSelectedCharacter = _ourCharacters[_currentCharacterIndex]
        _characterSelectorBox.setPosition(_currentSelectedCharacter.x, _currentSelectedCharacter.bottom + 40)
    }
})
spriteutils.createRenderable(100, function (screen2) {
    if (_showCharScreen) {
        scene.setBackgroundImage(assets.image`selectionMenu-bg`)
        _currentSelectedCharacter = _ourCharacters[_currentCharacterIndex]
        _characterSelectorBox.setPosition(_currentSelectedCharacter.x, _currentSelectedCharacter.bottom + 40)
    }
})
function freeze () {
    _gameRunning = false
    _playerSpeedBase = _playerSpeedBase * 0.00001
    controller.moveSprite(_thePlayer, _playerSpeedBase * _playerSpeedMod, _playerSpeedBase * _playerSpeedMod)
    for (let value of sprites.allOfKind(SpriteKind.EnemyWorm)) {
        sprites.setDataNumber(value, "vx", value.vx)
        sprites.setDataNumber(value, "vy", value.vy)
        value.setVelocity(0, 0)
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemyGoblin)) {
        sprites.setDataNumber(value, "vx", value.vx)
        sprites.setDataNumber(value, "vy", value.vy)
        value.setVelocity(0, 0)
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemyGoblinProjectile)) {
        sprites.setDataNumber(value, "vx", value.vx)
        sprites.setDataNumber(value, "vy", value.vy)
        value.setVelocity(0, 0)
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemySpider)) {
        sprites.setDataNumber(value, "vx", value.vx)
        sprites.setDataNumber(value, "vy", value.vy)
        value.setVelocity(0, 0)
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemySpiderProjectile)) {
        sprites.setDataNumber(value, "vx", value.vx)
        sprites.setDataNumber(value, "vy", value.vy)
        value.setVelocity(0, 0)
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemyBat)) {
        sprites.setDataNumber(value, "vx", value.vx)
        sprites.setDataNumber(value, "vy", value.vy)
        value.setVelocity(0, 0)
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemySkeleton)) {
        value.follow(_thePlayer, 0)
        sprites.setDataNumber(value, "vx", value.vx)
        sprites.setDataNumber(value, "vy", value.vy)
        value.setVelocity(0, 0)
    }
    for (let value of sprites.allOfKind(SpriteKind.EnemyBatProjectile)) {
        sprites.setDataNumber(value, "vx", value.vx)
        sprites.setDataNumber(value, "vy", value.vy)
        value.setVelocity(0, 0)
    }
    for (let value of sprites.allOfKind(SpriteKind.PlayerProjectile)) {
        sprites.setDataNumber(value, "vx", value.vx)
        sprites.setDataNumber(value, "vy", value.vy)
        value.setVelocity(0, 0)
    }
    for (let value of sprites.allOfKind(SpriteKind.SpecialProjectile)) {
        sprites.setDataNumber(value, "vx", value.vx)
        sprites.setDataNumber(value, "vy", value.vy)
        value.setVelocity(0, 0)
    }
}
sprites.onOverlap(SpriteKind.EnemyWorm, SpriteKind.EnemySpider, function (sprite, otherSprite) {
    if (_gameRunning) {
        sprites.destroy(otherSprite, effects.disintegrate, 500)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
function enemyShootAimingPlayer (sprite: Sprite, speed: number, spread: number) {
    shootBulletFromSprite(sprite, speed, Math.atan2(_thePlayer.y - sprite.y, _thePlayer.x - sprite.x) * 57.3 + randint(0 - spread, spread))
}
statusbars.onStatusReached(StatusBarKind.Energy, statusbars.StatusComparison.GTE, statusbars.ComparisonType.Percentage, 100, function (status3) {
    if (_gameRunning) {
        music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.InBackground)
        _specialReady = true
    }
})
function summonsBoss () {
    boss = sprites.create(assets.image`bossoff`, SpriteKind.EnemyBoss)
    animation.runImageAnimation(
    boss,
    assets.animation`bossAnim`,
    200,
    true
    )
    boss.setPosition(128, -16)
    MAX = 10
    _bossHealthBar = statusbars.create(192, 7, StatusBarKind.BossHealth)
    _bossHealthBar.setColor(2, 11)
    _bossHealthBar.setBarBorder(2, 12)
    _bossHealthBar.setPosition(scene.screenWidth() * 0.5, scene.screenHeight() * 0.05)
    _bossHealthBar.max = 3000
    _bossHealthBar.value = 3000
    offset = 0
    bossCanMove = true
    bossTime = true
    game.setDialogTextColor(2)
    game.showLongText("Você veio até aqui para morrer pelas minhas mãos?", DialogLayout.Bottom)
    game.showLongText("Irei lhe mostrar o que é poder de verdade", DialogLayout.Bottom)
    preSetBossPosition(128, 50)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.EnemyGoblinProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        _playerHealth.value += -15
        sprites.destroy(otherSprite, effects.trail, 100)
        scene.cameraShake(4, 200)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
sprites.onOverlap(SpriteKind.EnemyWorm, SpriteKind.EnemyBatProjectile, function (sprite, otherSprite) {
    if (_gameRunning) {
        sprites.destroy(otherSprite, effects.disintegrate, 500)
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
    }
})
function archerSpecial () {
    music.play(music.createSoundEffect(WaveShape.Noise, 1, 5000, 255, 0, 500, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    for (let index = 0; index < 5; index++) {
        pause(150)
        archerSpecialArrow()
    }
}
let _enemySpiderProjectile: Sprite = null
let _enemyGoblinProjectile: Sprite = null
let _enemyBatProjectile: Sprite = null
let _consumivelEnergia: Sprite = null
let _consumivelVida: Sprite = null
let bossProgress = 0
let bossCanMove = false
let speed = 0
let _bossProjectile: Sprite = null
let _knightRanged: Sprite = null
let _enemyWormSummonCD = 0
let _randomWorm = 0
let _enemyWorm: Sprite = null
let _enemySkeletonSummonCD = 0
let _enemySkeletonSpeedBase = 0
let _enemySkeletonHealthBar: StatusBarSprite = null
let _enemyBatSummonCD = 0
let _enemyBat: Sprite = null
let _enemyBatHealthBar: StatusBarSprite = null
let ready = false
let _animatedTower: Sprite = null
let _pressToStart: TextSprite = null
let _mageTitle: TextSprite = null
let _mageClass: Sprite = null
let _archerTitle: TextSprite = null
let _archerClass: Sprite = null
let _knightTitle: TextSprite = null
let _knightClass: Sprite = null
let _enemyGoblinSummonCD = 0
let _enemyGoblin: Sprite = null
let _enemyGoblinHealthbar: StatusBarSprite = null
let _enemySpiderSummonCD = 0
let _enemySpider: Sprite = null
let _enemySpiderHealthbar: StatusBarSprite = null
let _characterSelectorBox: Sprite = null
let _upgrade3desc: TextSprite = null
let _upgrade3: Sprite = null
let _upgrade2desc: TextSprite = null
let _upgrade2: Sprite = null
let _upgrade1desc: TextSprite = null
let _upgrade1: Sprite = null
let _textSprite: TextSprite = null
let _ourCharacters: Sprite[] = []
let offset = 0
let MAX = 0
let _attackCooldown = 0
let _currentCharacterIndex = 0
let _playerExperience: StatusBarSprite = null
let _currentSelectedCharacter: Sprite = null
let _showUpgradeScreen = false
let _showCharScreen = false
let _bossHealthBar: StatusBarSprite = null
let _WeaponUpgraded = false
let started = false
let _thePlayer: Sprite = null
let _playerSpeedBase = 0
let _playerHealth: StatusBarSprite = null
let _playerEnergy: StatusBarSprite = null
let _specialAttacking = false
let _attacking = false
let bossTime = false
let boss: Sprite = null
let _class = ""
let dy = 0
let dx = 0
let globalY = 0
let globalX = 0
let _gameRunning = false
let _specialCooldown = 0
let _stage = 0
let _specialReady = false
let _playerDamageMod = 0
let _playerSpeedMod = 0
let _enemyHealthMod = 0
let _EnemySpeedMod = 0
let _enemySkeleton: Sprite = null
let _specialWeapon: Sprite = null
let _weapon: Sprite = null
let _smallMage: Sprite = null
let _smallArcher: Sprite = null
let _smallKnight: Sprite = null
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 256
    export const ARCADE_SCREEN_HEIGHT = 256
}
Intro()
_smallKnight = sprites.create(assets.image`empty`, SpriteKind.Player)
_smallArcher = sprites.create(assets.image`empty`, SpriteKind.Player)
_smallMage = sprites.create(assets.image`empty`, SpriteKind.Player)
_weapon = sprites.create(assets.image`empty`, SpriteKind.PlayerProjectile)
_specialWeapon = sprites.create(assets.image`empty`, SpriteKind.PlayerProjectile)
_enemySkeleton = sprites.create(assets.image`empty`, SpriteKind.Enemy)
_EnemySpeedMod = 1
_enemyHealthMod = 1
_playerSpeedMod = 1
_playerDamageMod = 1
_specialReady = false
music.setVolume(20)
music.play(music.createSong(assets.song`level1song`), music.PlaybackMode.LoopingInBackground)
characterSelection()
let _scoreCounter = 5
_stage = 1
let _playerLevel = 1
_specialCooldown = 10000
let _stageScore = [
30,
60,
90,
120,
150
]
let _levelupScore = [
15,
35,
55,
75,
95,
115,
130,
145
]
info.setScore(0)
game.onUpdate(function () {
    if (_gameRunning) {
        if (_class == "knight") {
            if (_specialAttacking) {
                _specialWeapon.bottom = _thePlayer.top + 20
                _specialWeapon.x = _thePlayer.x
            }
            if (_attacking) {
                _weapon.bottom = _thePlayer.top
                _weapon.x = _thePlayer.x
            }
        }
    }
})
game.onUpdate(function () {
    if (_gameRunning) {
        if (info.score() >= _scoreCounter) {
            _scoreCounter += 5
            if (info.score() >= _stageScore[_stage - 1]) {
                music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
                freeze()
                sprites.destroyAllSpritesOfKind(SpriteKind.EnemyBat)
                sprites.destroyAllSpritesOfKind(SpriteKind.EnemySkeleton)
                sprites.destroyAllSpritesOfKind(SpriteKind.EnemyGoblin)
                sprites.destroyAllSpritesOfKind(SpriteKind.EnemySpider)
                sprites.destroyAllSpritesOfKind(SpriteKind.EnemyWorm)
                sprites.destroyAllSpritesOfKind(SpriteKind.EnemyGoblinProjectile)
                sprites.destroyAllSpritesOfKind(SpriteKind.EnemySpiderProjectile)
                sprites.destroyAllSpritesOfKind(SpriteKind.EnemyBatProjectile)
                sprites.destroyAllSpritesOfKind(SpriteKind.PlayerProjectile)
                _stage += 1
                if (_stage == 2) {
                    _enemyHealthMod += 0.09
                } else {
                    _enemyHealthMod += 0.12
                }
                _EnemySpeedMod += 0.08
                music.stopAllSounds()
                if (_stage == 2) {
                    music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
                    color.startFade(color.originalPalette, color.Black, 1000)
                    pause(1000)
                    tiles.setCurrentTilemap(tilemap`levelx`)
                    scene.setBackgroundImage(assets.image`stage2`)
                    color.startFade(color.Black, color.originalPalette, 1000)
                    pause(1000)
                    music.setVolume(20)
                    music.play(music.createSong(assets.song`level2song`), music.PlaybackMode.LoopingInBackground)
                    music.setVolume(255)
                    _thePlayer.setPosition(scene.screenWidth() / (2 * 1), scene.screenHeight() / 100 * 90)
                } else if (_stage == 3) {
                    music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
                    color.startFade(color.originalPalette, color.Black, 1000)
                    pause(1000)
                    tiles.setCurrentTilemap(tilemap`levelx`)
                    scene.setBackgroundImage(assets.image`stage3`)
                    color.startFade(color.Black, color.originalPalette, 1000)
                    pause(1000)
                    music.setVolume(20)
                    music.play(music.createSong(assets.song`level3song`), music.PlaybackMode.LoopingInBackground)
                    music.setVolume(255)
                    _thePlayer.setPosition(scene.screenWidth() / (2 * 1), scene.screenHeight() / 100 * 90)
                } else if (_stage == 4) {
                    music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
                    color.startFade(color.originalPalette, color.Black, 1000)
                    pause(1000)
                    tiles.setCurrentTilemap(tilemap`levelx`)
                    scene.setBackgroundImage(assets.image`stage4`)
                    color.startFade(color.Black, color.originalPalette, 1000)
                    pause(1000)
                    music.setVolume(20)
                    music.play(music.createSong(assets.song`level4song`), music.PlaybackMode.LoopingInBackground)
                    music.setVolume(255)
                    _thePlayer.setPosition(scene.screenWidth() / (2 * 1), scene.screenHeight() / 100 * 90)
                } else if (_stage == 5) {
                    music.play(music.melodyPlayable(music.beamUp), music.PlaybackMode.InBackground)
                    color.startFade(color.originalPalette, color.Black, 1000)
                    pause(1000)
                    tiles.setCurrentTilemap(tilemap`boss_level`)
                    scene.setBackgroundImage(assets.image`stage5`)
                    color.startFade(color.Black, color.originalPalette, 1000)
                    pause(1000)
                    music.setVolume(20)
                    music.play(music.createSong(assets.song`bossSong`), music.PlaybackMode.LoopingInBackground)
                    music.setVolume(255)
                    timer.after(2000, function () {
                        summonsBoss()
                        _thePlayer.setPosition(scene.screenWidth() / (2 * 1), scene.screenHeight() / 100 * 90)
                    })
                }
                unfreeze()
            }
            if (info.score() >= _levelupScore[_playerLevel - 1]) {
                _playerExperience.max = 20
                _playerExperience.value = 0
                if (_playerLevel == 5) {
                    _WeaponUpgraded = true
                    game.splash("WEAPON LEVEL UP!")
                }
                music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
                freeze()
                _playerLevel += 1
                game.splash("LEVEL UP!")
                levelUp()
            }
        }
    }
})
game.onUpdate(function () {
    if (bossTime) {
        if (Math.abs(boss.x - globalX) + Math.abs(boss.y - globalY) <= 10) {
            boss.setVelocity(0, 0)
            if (!(ready)) {
                bossProgress += 1
                if (bossProgress == 2) {
                    bossCanMove = false
                } else {
                    if (bossProgress == 2) {
                        MAX = 8
                    }
                    bossCanMove = true
                }
            }
            ready = true
        }
    }
})
game.onUpdateInterval(15000, function () {
    if (_gameRunning) {
        if (!(bossTime)) {
            if (_stage >= 2) {
                _consumivelVida = sprites.create(assets.image`consumivelVida`, SpriteKind.ConsumivelVida)
                timer.after(6000, function () {
                    sprites.destroy(_consumivelVida, effects.fire, 500)
                })
                _consumivelVida.setPosition(randint(30, scene.screenWidth() - 30), randint(30, scene.screenHeight() - 30))
                _consumivelVida.setFlag(SpriteFlag.AutoDestroy, true)
            }
        }
    }
})
game.onUpdateInterval(15000, function () {
    if (_gameRunning) {
        if (!(bossTime)) {
            if (_stage >= 2) {
                _consumivelEnergia = sprites.create(assets.image`consumivelEnergia`, SpriteKind.ConsumivelEnergia)
                timer.after(6000, function () {
                    sprites.destroy(_consumivelVida, effects.fire, 500)
                })
                _consumivelEnergia.setPosition(randint(30, scene.screenWidth() - 30), randint(30, scene.screenHeight() - 30))
                _consumivelEnergia.setFlag(SpriteFlag.AutoDestroy, true)
            }
        }
    }
})
game.onUpdateInterval(750, function () {
    if (bossTime) {
        if (started) {
            if (bossProgress == 3) {
                nonSpell2()
            }
        }
    }
})
game.onUpdateInterval(2500, function () {
    if (bossTime) {
        if (started && bossCanMove) {
            moveSpriteRandom(boss, 50, 8, 60)
        }
    }
})
game.onUpdateInterval(2000, function () {
    if (_gameRunning) {
        for (let value of sprites.allOfKind(SpriteKind.EnemyBat)) {
            _enemyBatProjectile = sprites.createProjectileFromSprite(assets.image`enemyBatProjectile`, value, 0, 50)
            _enemyBatProjectile.setKind(SpriteKind.EnemyBatProjectile)
            _enemyBatProjectile.setFlag(SpriteFlag.AutoDestroy, true)
        }
    }
})
game.onUpdateInterval(1000, function () {
    if (_gameRunning) {
        for (let value of sprites.allOfKind(SpriteKind.EnemyGoblin)) {
            _enemyGoblinProjectile = sprites.createProjectileFromSprite(assets.image`enemyGoblinProjectile`, value, 0, 100)
            _enemyGoblinProjectile.setKind(SpriteKind.EnemyBatProjectile)
            _enemyGoblinProjectile.setFlag(SpriteFlag.AutoDestroy, true)
        }
    }
})
forever(function () {
    if (_gameRunning) {
        if (_stage == 1) {
        	
        } else if (_stage == 2) {
            _enemyWormSummonCD = 20000
            summonWorm()
        } else if (_stage == 3) {
            _enemyWormSummonCD = 15000
            summonWorm()
        } else if (_stage == 4) {
            _enemyWormSummonCD = 10000
            summonWorm()
        } else if (_stage == 5) {
        	
        }
    }
})
forever(function () {
    if (_gameRunning) {
        if (_stage == 1) {
        	
        } else if (_stage == 2) {
        	
        } else if (_stage == 3) {
            _enemySpiderSummonCD = 12000
            summonSpider()
        } else if (_stage == 4) {
            _enemySpiderSummonCD = 10000
            summonSpider()
        } else if (_stage == 5) {
        	
        }
    }
})
forever(function () {
    if (_gameRunning) {
        if (_stage == 1) {
            _enemySkeletonSpeedBase = 30
            _enemySkeletonSummonCD = 3000
            summonSkeleton()
        } else if (_stage == 2) {
            _enemySkeletonSpeedBase = 35
            _enemySkeletonSummonCD = 2500
            summonSkeleton()
        } else if (_stage == 3) {
        	
        } else if (_stage == 4) {
            _enemySkeletonSpeedBase = 40
            _enemySkeletonSummonCD = 1500
            summonSkeleton()
        } else if (_stage == 5) {
        	
        }
    }
})
forever(function () {
    if (_gameRunning) {
        if (_stage == 1) {
            if (info.score() >= 10) {
                _enemyBatSummonCD = 10000
                summonBat()
            }
        } else if (_stage == 2) {
            _enemyBatSummonCD = 9000
            summonBat()
        } else if (_stage == 3) {
        	
        } else if (_stage == 4) {
        	
        } else if (_stage == 5) {
        	
        }
    }
})
forever(function () {
    if (_gameRunning) {
        if (_stage == 1) {
        	
        } else if (_stage == 2) {
        	
        } else if (_stage == 3) {
            _enemyGoblinSummonCD = 12000
            summonGoblin()
        } else if (_stage == 4) {
            _enemyGoblinSummonCD = 12000
            summonGoblin()
        } else if (_stage == 5) {
        	
        }
    }
})
game.onUpdateInterval(150, function () {
    if (bossTime) {
        if (started) {
            if (bossProgress == 2) {
                spell1()
            } else {
                if (bossProgress == 4) {
                    spell2()
                }
            }
        }
    }
})
game.onUpdateInterval(500, function () {
    if (_gameRunning) {
        _playerEnergy.value += 1
    }
})
game.onUpdateInterval(500, function () {
    if (bossTime) {
        if (started) {
            if (bossProgress == 1) {
                nonSpell1()
            }
        }
    }
})
game.onUpdateInterval(100, function () {
    if (bossTime) {
        if (ready && !(started)) {
            started = true
        }
    }
})
game.onUpdateInterval(3000, function () {
    if (_gameRunning) {
        for (let value of sprites.allOfKind(SpriteKind.EnemySpider)) {
            _enemySpiderProjectile = sprites.createProjectileFromSprite(assets.image`enemySpiderProjectile`, value, 0, 125)
            _enemySpiderProjectile.setKind(SpriteKind.EnemySpiderProjectile)
            _enemySpiderProjectile.setFlag(SpriteFlag.AutoDestroy, true)
            value.vx = value.vx * -1
        }
    }
})
