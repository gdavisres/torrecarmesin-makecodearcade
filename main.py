@namespace
class SpriteKind:
    EnemyProjectile = SpriteKind.create()
    PlayerProjectile = SpriteKind.create()
    SelectableCharacter = SpriteKind.create()
    Background = SpriteKind.create()
    SpecialProjectile = SpriteKind.create()
    Upgrade = SpriteKind.create()
    LifeBar = SpriteKind.create()
@namespace
class StatusBarKind:
    Experience = StatusBarKind.create()

def on_on_overlap(sprite, otherSprite):
    if _gameRunning:
        if otherSprite == _enemyBatProjectile:
            _playerHealth.value += -10
        sprites.destroy(otherSprite, effects.trail, 500)
        scene.camera_shake(4, 200)
        music.play(music.melody_playable(music.thump),
            music.PlaybackMode.IN_BACKGROUND)
sprites.on_overlap(SpriteKind.player, SpriteKind.EnemyProjectile, on_on_overlap)

def on_on_overlap2(sprite6, otherSprite6):
    if _gameRunning:
        if _class == "knight":
            if _WeaponUpgraded:
                sprite6.set_flag(SpriteFlag.GHOST_THROUGH_SPRITES, True)
                statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, sprite6).value += -110 * _playerDamageMod
                
                def on_after():
                    sprite6.set_flag(SpriteFlag.GHOST_THROUGH_SPRITES, False)
                timer.after(100, on_after)
                
            else:
                sprite6.set_flag(SpriteFlag.GHOST_THROUGH_SPRITES, True)
                statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, sprite6).value += -55 * _playerDamageMod
                
                def on_after2():
                    sprite6.set_flag(SpriteFlag.GHOST_THROUGH_SPRITES, False)
                timer.after(100, on_after2)
                
        elif _class == "archer":
            if _WeaponUpgraded:
                sprites.destroy(otherSprite6)
                statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, sprite6).value += -55 * _playerDamageMod
            else:
                sprites.destroy(otherSprite6)
                statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, sprite6).value += -55 * _playerDamageMod
        elif _class == "mage":
            if _WeaponUpgraded:
                sprites.destroy(otherSprite6)
                statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, sprite6).value += -55 * _playerDamageMod
            else:
                sprites.destroy(otherSprite6)
                statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, sprite6).value += -27.5 * _playerDamageMod
        music.play(music.melody_playable(music.thump),
            music.PlaybackMode.IN_BACKGROUND)
sprites.on_overlap(SpriteKind.enemy,
    SpriteKind.PlayerProjectile,
    on_on_overlap2)

def on_b_pressed():
    global _specialAttacking, _attacking, _specialCooldown, _specialReady
    # Checa se está atacando, para poder definir um tempo de recarga entre ataques
    if not (_attacking):
        if _specialReady:
            _specialAttacking = True
            _attacking = True
            if _class == "knight":
                knightSpecial()
            elif _class == "archer":
                archerSpecial()
            elif _class == "mage":
                mageSpecial()
            _specialCooldown = game.runtime()
            _attacking = False
            _specialReady = False
            _playerEnergy.value = 0
controller.B.on_event(ControllerButtonEvent.PRESSED, on_b_pressed)

def on_on_zero(status2):
    scene.camera_shake(4, 2000)
    music.stop_all_sounds()
    music.set_volume(50)
    game.set_game_over_message(False, "GAME OVER!")
    game.set_game_over_playable(False, music.melody_playable(music.wawawawaa), False)
    game.game_over(False)
statusbars.on_zero(StatusBarKind.health, on_on_zero)

def on_on_overlap3(sprite3, otherSprite3):
    if _gameRunning:
        if _class == "knight":
            sprite3.set_flag(SpriteFlag.GHOST_THROUGH_SPRITES, True)
            statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, sprite3).value += -110 * _playerDamageMod
            
            def on_after3():
                sprite3.set_flag(SpriteFlag.GHOST_THROUGH_SPRITES, False)
            timer.after(100, on_after3)
            
        elif _class == "archer":
            sprites.destroy(otherSprite3)
            statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, sprite3).value += -55 * _playerDamageMod
        elif _class == "mage":
            sprite3.set_flag(SpriteFlag.GHOST_THROUGH_SPRITES, True)
            statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, sprite3).value += -110 * _playerDamageMod
            
            def on_after4():
                sprite3.set_flag(SpriteFlag.GHOST_THROUGH_SPRITES, False)
            timer.after(100, on_after4)
            
        music.play(music.melody_playable(music.thump),
            music.PlaybackMode.IN_BACKGROUND)
sprites.on_overlap(SpriteKind.enemy,
    SpriteKind.SpecialProjectile,
    on_on_overlap3)

def on_a_pressed():
    global _thePlayer, _playerHealth, _playerEnergy, _playerExperience, _class, _playerDamageBase, _playerSpeedBase, _gameRunning, _showCharScreen, _playerDamageMod, _playerSpeedMod, _showUpgradeScreen, _attacking, _attackCooldown
    if _showCharScreen:
        _thePlayer = sprites.read_data_sprite(_currentSelectedCharacter, "player")
        _playerHealth = statusbars.create(50, 6, StatusBarKind.health)
        _playerHealth.set_color(7, 2)
        _playerHealth.set_label("HP", 15)
        _playerHealth.position_direction(CollisionDirection.TOP)
        _playerHealth.set_offset_padding(-35, 5)
        _playerHealth.set_bar_border(1, 1)
        _playerEnergy = statusbars.create(50, 6, StatusBarKind.energy)
        _playerEnergy.set_status_bar_flag(StatusBarFlag.SMOOTH_TRANSITION, True)
        _playerEnergy.set_color(8, 13, 13)
        _playerEnergy.set_label("MP", 15)
        _playerEnergy.position_direction(CollisionDirection.TOP)
        _playerEnergy.set_offset_padding(35, 5)
        _playerEnergy.set_bar_border(1, 1)
        # special cooldown
        _playerEnergy.max = 30
        _playerEnergy.value = 0
        _playerExperience = statusbars.create(100, 4, StatusBarKind.Experience)
        _playerExperience.set_status_bar_flag(StatusBarFlag.SMOOTH_TRANSITION, True)
        _playerExperience.set_color(5, 13, 13)
        _playerExperience.set_label("EXP", 15)
        _playerExperience.position_direction(CollisionDirection.BOTTOM)
        _playerExperience.set_offset_padding(0, 5)
        _playerExperience.set_bar_border(1, 1)
        _playerExperience.max = 15
        _playerExperience.value = 0
        if _currentCharacterIndex == 0:
            _class = "knight"
            _playerHealth.max = 100
            _playerEnergy.value = 0
            _playerDamageBase = 2
            _playerSpeedBase = 70
            _smallKnight.set_image(assets.image("""
                smallKnight
            """))
            animation.run_image_animation(_thePlayer,
                assets.animation("""
                    miniKnightAnim
                """),
                200,
                True)
        elif _currentCharacterIndex == 1:
            _class = "archer"
            _playerHealth.max = 80
            _playerDamageBase = 2
            _playerSpeedBase = 90
            _smallArcher.set_image(assets.image("""
                player
            """))
        elif _currentCharacterIndex == 2:
            _class = "mage"
            _playerHealth.max = 70
            _playerDamageBase = 0.5
            _playerSpeedBase = 70
            _smallMage.set_image(assets.image("""
                myImage0
            """))
        _thePlayer.set_flag(SpriteFlag.INVISIBLE, False)
        _thePlayer.set_position(80, 105)
        _thePlayer.set_stay_in_screen(True)
        for value in sprites.all_of_kind(SpriteKind.SelectableCharacter):
            sprites.destroy(value)
        for value2 in sprites.all_of_kind(SpriteKind.Background):
            sprites.destroy(value2)
        for value3 in sprites.all_of_kind(SpriteKind.text):
            sprites.destroy(value3)
        color.start_fade(color.original_palette, color.black, 1000)
        tiles.set_current_tilemap(tilemap("""
            stage1
        """))
        pause(1000)
        color.start_fade(color.black, color.original_palette, 1000)
        controller.move_sprite(_thePlayer, _playerSpeedBase, _playerSpeedBase)
        _gameRunning = True
        music.set_volume(255)
        _showCharScreen = False
    elif _showUpgradeScreen:
        if _currentCharacterIndex == 0:
            _playerDamageMod += 0.2
        elif _currentCharacterIndex == 1:
            _playerSpeedMod += 0.1
            controller.move_sprite(_thePlayer,
                _playerSpeedBase * _playerSpeedMod,
                _playerSpeedBase * _playerSpeedMod)
        elif _currentCharacterIndex == 2:
            if _stage == 1:
                _playerHealth.max += 10
                _playerHealth.value += 30
        for value4 in sprites.all_of_kind(SpriteKind.Upgrade):
            sprites.destroy(value4)
        for value5 in sprites.all_of_kind(SpriteKind.Background):
            sprites.destroy(value5)
        for value6 in sprites.all_of_kind(SpriteKind.text):
            sprites.destroy(value6)
        unfreeze()
        _thePlayer.set_flag(SpriteFlag.GHOST_THROUGH_SPRITES, True)
        
        def on_after5():
            _thePlayer.set_flag(SpriteFlag.GHOST_THROUGH_SPRITES, False)
        timer.after(1000, on_after5)
        
        _showUpgradeScreen = False
    elif not (_attacking):
        _attacking = True
        if _class == "knight":
            if _WeaponUpgraded:
                if game.runtime() - _attackCooldown >= 750:
                    knightSAttack()
                    _attackCooldown = game.runtime()
            elif game.runtime() - _attackCooldown >= 750:
                knightAttack()
                _attackCooldown = game.runtime()
        elif _class == "archer":
            if _WeaponUpgraded:
                if game.runtime() - _attackCooldown >= 500:
                    archerSAttack()
                    _attackCooldown = game.runtime()
            elif game.runtime() - _attackCooldown >= 1000:
                archerAttack()
                _attackCooldown = game.runtime()
        elif _class == "mage":
            if _WeaponUpgraded:
                if game.runtime() - _attackCooldown >= 250:
                    mageSAttack()
                    _attackCooldown = game.runtime()
            elif game.runtime() - _attackCooldown >= 250:
                mageAttack()
                _attackCooldown = game.runtime()
        _attacking = False
controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)

def knightSpecial():
    global _specialWeapon
    music.play(music.create_sound_effect(WaveShape.NOISE,
            4614,
            1,
            255,
            0,
            1000,
            SoundExpressionEffect.NONE,
            InterpolationCurve.CURVE),
        music.PlaybackMode.IN_BACKGROUND)
    pause(1000)
    music.play(music.create_sound_effect(WaveShape.NOISE,
            1663,
            4873,
            255,
            0,
            1000,
            SoundExpressionEffect.NONE,
            InterpolationCurve.CURVE),
        music.PlaybackMode.IN_BACKGROUND)
    _specialWeapon = sprites.create(assets.image("""
            empty64
        """),
        SpriteKind.PlayerProjectile)
    animation.run_image_animation(_specialWeapon,
        assets.animation("""
            specialSwordAnimation
        """),
        200,
        False)
    _specialWeapon.set_kind(SpriteKind.SpecialProjectile)
    scaling.scale_to_percent(_specialWeapon,
        100,
        ScaleDirection.UNIFORMLY,
        ScaleAnchor.MIDDLE)

def on_on_overlap4(sprite5, otherSprite5):
    if _gameRunning:
        if sprite5 == _enemyBat:
            _playerHealth.value += -5
        elif sprite5 == _enemySkeleton:
            _playerHealth.value += -10
        else:
            _playerHealth.value += -10
        sprites.destroy(sprite5, effects.disintegrate, 500)
        scene.camera_shake(4, 200)
        music.play(music.melody_playable(music.knock),
            music.PlaybackMode.IN_BACKGROUND)
sprites.on_overlap(SpriteKind.enemy, SpriteKind.player, on_on_overlap4)

def on_on_overlap5(sprite2, otherSprite2):
    if _gameRunning:
        if _class == "knight":
            sprites.destroy(sprite2, effects.fountain, 100)
        elif _class == "archer":
            sprites.destroy(sprite2, effects.trail, 100)
        elif _class == "mage":
            sprites.destroy(sprite2, effects.fire, 100)
        music.play(music.melody_playable(music.thump),
            music.PlaybackMode.IN_BACKGROUND)
sprites.on_overlap(SpriteKind.EnemyProjectile,
    SpriteKind.SpecialProjectile,
    on_on_overlap5)

def on_left_pressed():
    global _currentCharacterIndex
    if _showCharScreen or _showUpgradeScreen:
        _currentCharacterIndex = (_currentCharacterIndex + (len(_ourCharacters) - 1)) % len(_ourCharacters)
controller.left.on_event(ControllerButtonEvent.PRESSED, on_left_pressed)

def knightAttack():
    global _weapon
    music.play(music.create_sound_effect(WaveShape.NOISE,
            1663,
            4873,
            255,
            0,
            200,
            SoundExpressionEffect.NONE,
            InterpolationCurve.CURVE),
        music.PlaybackMode.IN_BACKGROUND)
    _weapon = sprites.create(assets.image("""
            knightAttack
        """),
        SpriteKind.PlayerProjectile)
    _weapon.set_flag(SpriteFlag.GHOST_THROUGH_SPRITES, False)
    _weapon.set_kind(SpriteKind.PlayerProjectile)
    pause(100)
    _weapon.set_image(assets.image("""
        empty
    """))
def levelUp():
    global _showUpgradeScreen, _textSprite, _upgrade1, _upgrade1desc, _upgrade2, _upgrade2desc, _upgrade3, _upgrade3desc, _ourCharacters, _currentCharacterIndex, _characterSelectorBox
    scene.center_camera_at(scene.screen_width() / 2, scene.screen_height() / 2)
    _showUpgradeScreen = True
    _textSprite = textsprite.create("Escolha uma melhoria", 0, 1)
    _textSprite.z = 101
    _textSprite.set_position(scene.screen_width() / 2 * 1, scene.screen_height() / 5 * 1)
    _textSprite.set_max_font_height(8)
    _textSprite.set_outline(1, 2)
    scaling.scale_by_percent(_textSprite,
        50,
        ScaleDirection.UNIFORMLY,
        ScaleAnchor.MIDDLE)
    _upgrade1 = sprites.create(assets.image("""
        upgrade1
    """), SpriteKind.Upgrade)
    _upgrade1.z = 101
    _upgrade1.set_position(scene.screen_width() / 12 * 2, scene.screen_height() / 2 * 1)
    _upgrade1desc = textsprite.create("poder", 0, 1)
    _upgrade1desc.z = 101
    _upgrade1desc.set_position(_upgrade1.x, _upgrade1.bottom + 20)
    _upgrade1desc.set_max_font_height(8)
    _upgrade2 = sprites.create(assets.image("""
        upgrade2
    """), SpriteKind.Upgrade)
    _upgrade2.z = 101
    _upgrade2.set_position(scene.screen_width() / 12, scene.screen_height() / 2 * 1)
    _upgrade2desc = textsprite.create("velocidade", 0, 1)
    _upgrade2desc.z = 101
    _upgrade2desc.set_position(_upgrade2.x, _upgrade2.y)
    _upgrade2desc.set_max_font_height(8)
    _upgrade3 = sprites.create(assets.image("""
        upgrade3
    """), SpriteKind.Upgrade)
    _upgrade3.z = 101
    _upgrade3.set_position(scene.screen_width() / 12, scene.screen_height() / 2 * 1)
    _upgrade3desc = textsprite.create("vida", 0, 1)
    _upgrade3desc.z = 101
    _upgrade3desc.set_position(_upgrade3.x, _upgrade3.y)
    _upgrade3desc.set_max_font_height(8)
    _ourCharacters = [_upgrade1, _upgrade2, _upgrade3]
    _currentCharacterIndex = 1
    _characterSelectorBox = sprites.create(assets.image("""
        selector
    """), SpriteKind.Background)
    _characterSelectorBox.z = 101
def archerSAttack():
    global _weapon
    music.play(music.create_sound_effect(WaveShape.NOISE,
            196,
            2737,
            182,
            0,
            150,
            SoundExpressionEffect.NONE,
            InterpolationCurve.LOGARITHMIC),
        music.PlaybackMode.IN_BACKGROUND)
    music.play(music.create_sound_effect(WaveShape.SAWTOOTH,
            368,
            1,
            255,
            0,
            200,
            SoundExpressionEffect.NONE,
            InterpolationCurve.CURVE),
        music.PlaybackMode.IN_BACKGROUND)
    _weapon = sprites.create_projectile_from_sprite(assets.image("""
        archerSAttack
    """), _thePlayer, 0, -100)
    _weapon.set_kind(SpriteKind.PlayerProjectile)
    _weapon.set_flag(SpriteFlag.AUTO_DESTROY, True)
def mageAttack():
    global _weapon
    music.play(music.create_sound_effect(WaveShape.TRIANGLE,
            1,
            1935,
            255,
            0,
            80,
            SoundExpressionEffect.NONE,
            InterpolationCurve.LOGARITHMIC),
        music.PlaybackMode.IN_BACKGROUND)
    _weapon = sprites.create_projectile_from_sprite(assets.image("""
        mageAttack
    """), _thePlayer, 0, -60)
    _weapon.set_kind(SpriteKind.PlayerProjectile)
    _weapon.set_flag(SpriteFlag.AUTO_DESTROY, True)

def on_on_zero2(status):
    if _gameRunning:
        _playerExperience.value += 1
        sprites.destroy(status.sprite_attached_to(), effects.fountain, 100)
        info.change_score_by(1)
statusbars.on_zero(StatusBarKind.enemy_health, on_on_zero2)

def on_on_overlap6(sprite4, otherSprite4):
    if _gameRunning:
        if _class == "knight":
            sprites.destroy(sprite4, effects.fountain, 100)
        elif _class == "archer":
            sprites.destroy(sprite4, effects.trail, 100)
            sprites.destroy(otherSprite4)
        elif _class == "mage":
            sprites.destroy(sprite4, effects.fire, 100)
            sprites.destroy(otherSprite4)
        music.play(music.melody_playable(music.thump),
            music.PlaybackMode.IN_BACKGROUND)
sprites.on_overlap(SpriteKind.EnemyProjectile,
    SpriteKind.PlayerProjectile,
    on_on_overlap6)

def mageSpecial():
    global _specialWeapon
    music.play(music.create_sound_effect(WaveShape.NOISE,
            1,
            5000,
            255,
            0,
            500,
            SoundExpressionEffect.NONE,
            InterpolationCurve.CURVE),
        music.PlaybackMode.IN_BACKGROUND)
    pause(1000)
    music.play(music.create_sound_effect(WaveShape.SAWTOOTH,
            644,
            2082,
            255,
            0,
            381,
            SoundExpressionEffect.WARBLE,
            InterpolationCurve.CURVE),
        music.PlaybackMode.IN_BACKGROUND)
    _specialWeapon = sprites.create_projectile_from_sprite(assets.image("""
        fireball
    """), _thePlayer, 0, -60)
    scaling.scale_to_percent(_specialWeapon,
        200,
        ScaleDirection.UNIFORMLY,
        ScaleAnchor.MIDDLE)
    _specialWeapon.set_kind(SpriteKind.SpecialProjectile)
    _specialWeapon.set_flag(SpriteFlag.AUTO_DESTROY, True)

def on_right_pressed():
    global _currentCharacterIndex
    if _showCharScreen or _showUpgradeScreen:
        _currentCharacterIndex = (_currentCharacterIndex + 1) % len(_ourCharacters)
controller.right.on_event(ControllerButtonEvent.PRESSED, on_right_pressed)

def characterSelection():
    global _showCharScreen, _textSprite, _knightClass, _knightTitle, _archerClass, _archerTitle, _mageClass, _mageTitle, _ourCharacters, _currentCharacterIndex, _characterSelectorBox
    scene.center_camera_at(scene.screen_width() / 2, scene.screen_height() / 2)
    for value7 in sprites.all_of_kind(SpriteKind.player):
        value7.set_flag(SpriteFlag.INVISIBLE, True)
    _showCharScreen = True
    _textSprite = textsprite.create("Escolha seu personagem", 0, 1)
    _textSprite.z = 101
    _textSprite.set_position(scene.screen_width() / 2 * 1, scene.screen_height() / 5 * 1)
    _textSprite.set_max_font_height(8)
    _textSprite.set_outline(1, 2)
    scaling.scale_by_percent(_textSprite,
        50,
        ScaleDirection.UNIFORMLY,
        ScaleAnchor.MIDDLE)
    _knightClass = sprites.create(assets.image("""
            knight
        """),
        SpriteKind.SelectableCharacter)
    _knightClass.z = 101
    _knightClass.set_position(scene.screen_width() / 12 * 2, scene.screen_height() / 2 * 1)
    sprites.set_data_sprite(_knightClass, "player", _smallKnight)
    _knightTitle = textsprite.create("Knight", 0, 1)
    _knightTitle.z = 101
    _knightTitle.set_position(_knightClass.x, _knightClass.bottom + 20)
    _knightTitle.set_max_font_height(8)
    _archerClass = sprites.create(assets.image("""
            archer
        """),
        SpriteKind.SelectableCharacter)
    _archerClass.z = 101
    _archerClass.set_position(scene.screen_width() / 12 * 6, scene.screen_height() / 2 * 1)
    sprites.set_data_sprite(_archerClass, "player", _smallArcher)
    _archerTitle = textsprite.create("Archer", 0, 1)
    _archerTitle.z = 101
    _archerTitle.set_position(_archerClass.x, _archerClass.bottom + 20)
    _archerTitle.set_max_font_height(8)
    _mageClass = sprites.create(assets.image("""
            mage
        """),
        SpriteKind.SelectableCharacter)
    _mageClass.z = 101
    _mageClass.set_position(scene.screen_width() / 12 * 10,
        scene.screen_height() / 2 * 1)
    sprites.set_data_sprite(_mageClass, "player", _smallMage)
    _mageTitle = textsprite.create("Mage", 0, 1)
    _mageTitle.z = 101
    _mageTitle.set_position(_mageClass.x, _mageClass.bottom + 20)
    _mageTitle.set_max_font_height(8)
    _ourCharacters = [_knightClass, _archerClass, _mageClass]
    _currentCharacterIndex = 1
    _characterSelectorBox = sprites.create(assets.image("""
        selector
    """), SpriteKind.Background)
    _characterSelectorBox.z = 101
def mageSAttack():
    global _weapon
    music.play(music.create_sound_effect(WaveShape.TRIANGLE,
            1166,
            1,
            255,
            0,
            130,
            SoundExpressionEffect.NONE,
            InterpolationCurve.LOGARITHMIC),
        music.PlaybackMode.IN_BACKGROUND)
    _weapon = sprites.create_projectile_from_sprite(assets.image("""
        mageAttackS
    """), _thePlayer, 0, -60)
    _weapon.set_kind(SpriteKind.PlayerProjectile)
    _weapon.set_flag(SpriteFlag.AUTO_DESTROY, True)

def on_create_renderable(screen22):
    global _currentSelectedCharacter
    if _showUpgradeScreen:
        screen22.fill(6)
        _currentSelectedCharacter = _ourCharacters[_currentCharacterIndex]
        _characterSelectorBox.set_position(_currentSelectedCharacter.x,
            _currentSelectedCharacter.bottom + 40)
spriteutils.create_renderable(100, on_create_renderable)

def on_create_renderable2(screen2):
    global _currentSelectedCharacter
    if _showCharScreen:
        screen2.fill(6)
        _currentSelectedCharacter = _ourCharacters[_currentCharacterIndex]
        _characterSelectorBox.set_position(_currentSelectedCharacter.x,
            _currentSelectedCharacter.bottom + 40)
spriteutils.create_renderable(100, on_create_renderable2)

def archerAttack():
    global _weapon
    music.play(music.create_sound_effect(WaveShape.NOISE,
            196,
            2737,
            182,
            0,
            150,
            SoundExpressionEffect.NONE,
            InterpolationCurve.LOGARITHMIC),
        music.PlaybackMode.IN_BACKGROUND)
    music.play(music.create_sound_effect(WaveShape.SQUARE,
            848,
            1,
            255,
            0,
            100,
            SoundExpressionEffect.NONE,
            InterpolationCurve.CURVE),
        music.PlaybackMode.IN_BACKGROUND)
    _weapon = sprites.create_projectile_from_sprite(assets.image("""
        archerAttack
    """), _thePlayer, 0, -80)
    _weapon.set_kind(SpriteKind.PlayerProjectile)
    _weapon.set_flag(SpriteFlag.AUTO_DESTROY, True)
def archerSpecialArrow():
    global _specialWeapon
    music.play(music.create_sound_effect(WaveShape.NOISE,
            196,
            2737,
            182,
            0,
            150,
            SoundExpressionEffect.NONE,
            InterpolationCurve.LOGARITHMIC),
        music.PlaybackMode.IN_BACKGROUND)
    music.play(music.create_sound_effect(WaveShape.SQUARE,
            848,
            1,
            255,
            0,
            100,
            SoundExpressionEffect.NONE,
            InterpolationCurve.CURVE),
        music.PlaybackMode.IN_BACKGROUND)
    _specialWeapon = sprites.create_projectile_from_sprite(assets.image("""
        arrowSpecial
    """), _thePlayer, 0, -70)
    _specialWeapon.set_kind(SpriteKind.SpecialProjectile)
    _specialWeapon.set_flag(SpriteFlag.AUTO_DESTROY, True)
def knightSAttack():
    music.play(music.create_sound_effect(WaveShape.NOISE,
            3189,
            334,
            255,
            0,
            200,
            SoundExpressionEffect.NONE,
            InterpolationCurve.CURVE),
        music.PlaybackMode.IN_BACKGROUND)
    _weapon.set_image(assets.image("""
        knightSAttack
    """))
    _weapon.set_flag(SpriteFlag.GHOST_THROUGH_SPRITES, False)
    _weapon.set_kind(SpriteKind.PlayerProjectile)
    pause(100)
    _weapon.set_image(assets.image("""
        empty
    """))
def unfreeze():
    global _gameRunning
    _gameRunning = True
    _enemySkeleton.follow(_thePlayer, _skeletonSpeedBase * _EnemySpeedMod)
    for value8 in sprites.all_of_kind(SpriteKind.enemy):
        value8.set_velocity(value8.vx, value8.vy)
    for value9 in sprites.all_of_kind(SpriteKind.EnemyProjectile):
        value9.set_velocity(value9.vx, value9.vy)
    for value10 in sprites.all_of_kind(SpriteKind.PlayerProjectile):
        value10.set_velocity(value10.vx, value10.vy)
def freeze():
    global _gameRunning
    _gameRunning = False
    _enemySkeleton.follow(_thePlayer, 0)
    for value11 in sprites.all_of_kind(SpriteKind.enemy):
        sprites.set_data_number(value11, "vx", value11.vx)
        sprites.set_data_number(value11, "vy", value11.vy)
        
        def on_debounce():
            value11.set_velocity(0, 0)
        timer.debounce("action", 500, on_debounce)
        
    for value12 in sprites.all_of_kind(SpriteKind.EnemyProjectile):
        sprites.set_data_number(value12, "vx", value12.vx)
        sprites.set_data_number(value12, "vy", value12.vy)
        
        def on_debounce2():
            value12.set_velocity(0, 0)
        timer.debounce("action", 500, on_debounce2)
        
    for value13 in sprites.all_of_kind(SpriteKind.PlayerProjectile):
        sprites.set_data_number(value13, "vx", value13.vx)
        sprites.set_data_number(value13, "vy", value13.vy)
        
        def on_debounce3():
            value13.set_velocity(0, 0)
        timer.debounce("action", 500, on_debounce3)
        

def on_status_reached_comparison_eq_type_percentage(status3):
    global _specialReady
    if _gameRunning:
        music.play(music.melody_playable(music.magic_wand),
            music.PlaybackMode.IN_BACKGROUND)
        _specialReady = True
statusbars.on_status_reached(StatusBarKind.energy,
    statusbars.StatusComparison.EQ,
    statusbars.ComparisonType.PERCENTAGE,
    100,
    on_status_reached_comparison_eq_type_percentage)

def archerSpecial():
    music.play(music.create_sound_effect(WaveShape.NOISE,
            1,
            5000,
            255,
            0,
            500,
            SoundExpressionEffect.NONE,
            InterpolationCurve.CURVE),
        music.PlaybackMode.IN_BACKGROUND)
    for index in range(5):
        pause(150)
        archerSpecialArrow()
_enemySkeletonHealthBar: StatusBarSprite = None
_enemyBatHealthBar: StatusBarSprite = None
_skeletonSpeedBase = 0
_mageTitle: TextSprite = None
_mageClass: Sprite = None
_archerTitle: TextSprite = None
_archerClass: Sprite = None
_knightTitle: TextSprite = None
_knightClass: Sprite = None
_characterSelectorBox: Sprite = None
_upgrade3desc: TextSprite = None
_upgrade3: Sprite = None
_upgrade2desc: TextSprite = None
_upgrade2: Sprite = None
_upgrade1desc: TextSprite = None
_upgrade1: Sprite = None
_textSprite: TextSprite = None
_ourCharacters: List[Sprite] = []
_enemyBat: Sprite = None
_attackCooldown = 0
_playerSpeedBase = 0
_playerDamageBase = 0
_currentCharacterIndex = 0
_playerExperience: StatusBarSprite = None
_currentSelectedCharacter: Sprite = None
_thePlayer: Sprite = None
_showUpgradeScreen = False
_showCharScreen = False
_playerEnergy: StatusBarSprite = None
_specialAttacking = False
_attacking = False
_WeaponUpgraded = False
_class = ""
_playerHealth: StatusBarSprite = None
_enemyBatProjectile: Sprite = None
_gameRunning = False
_specialCooldown = 0
_stage = 0
_specialReady = False
_playerDamageMod = 0
_playerSpeedMod = 0
_EnemySpeedMod = 0
_enemySkeleton: Sprite = None
_specialWeapon: Sprite = None
_weapon: Sprite = None
_smallMage: Sprite = None
_smallArcher: Sprite = None
_smallKnight: Sprite = None
@namespace
class userconfig:
    ARCADE_SCREEN_WIDTH = 256
    ARCADE_SCREEN_HEIGHT = 256
music.play(music.create_song(assets.song("""
        menu_song
    """)),
    music.PlaybackMode.LOOPING_IN_BACKGROUND)
scene.set_background_image(assets.image("""
    menu-bg
"""))
pause(2000)
game.show_long_text("PRESSIONE 'A' PARA INICIAR", DialogLayout.BOTTOM)
game.show_long_text("-Mova com os direcionais -Ataque com A  -Use o ataque especial com B",
    DialogLayout.CENTER)
music.stop_all_sounds()
music.play(music.melody_playable(music.spooky),
    music.PlaybackMode.IN_BACKGROUND)
color.start_fade(color.original_palette, color.black, 1000)
pause(1000)
color.start_fade(color.black, color.original_palette, 1000)
_smallKnight = sprites.create(assets.image("""
    empty
"""), SpriteKind.player)
_smallArcher = sprites.create(assets.image("""
    empty
"""), SpriteKind.player)
_smallMage = sprites.create(assets.image("""
    empty
"""), SpriteKind.player)
_weapon = sprites.create(assets.image("""
    empty
"""), SpriteKind.PlayerProjectile)
_specialWeapon = sprites.create(assets.image("""
    empty
"""), SpriteKind.PlayerProjectile)
_enemySkeleton = sprites.create(assets.image("""
    empty
"""), SpriteKind.enemy)
_EnemySpeedMod = 1
_enemyHealthMod = 1
_playerSpeedMod = 1
_playerDamageMod = 1
_specialReady = False
music.set_volume(20)
music.play(music.create_song(assets.song("""
        level1song
    """)),
    music.PlaybackMode.LOOPING_IN_BACKGROUND)
characterSelection()
_scoreCounter = 5
_stage = 1
_playerLevel = 1
_specialCooldown = 10000
_stageScore = [30, 60, 90, 120, 150]
_levelupScore = [15, 35, 55, 75, 95, 115, 130, 145]
info.set_score(0)
gwynmidi = ArcadeMIDIBlocks.create_wrapper()
gwynmidi.set_images([img("""
    ..3c...a64.4.2....1c...1.a..64..f4.164.....4...........................5.....2.e.4....36...33122361b..51...23.2937..6d...3312e3652..88...13.6d..a3...431363f3f88..be...13.a4..da...53136223a3abf..f5...23.29da..1..1.32e3136f6..2c.1.13.11.147.1.231362c.162.1.13.47.17d.1.331362263.199.1.23.297e.1b4.1.331362e99.1cf.1.13.b4.1ea.1.431363f3fd..1.6.2.13.eb.121.2.3313622.6.23c.2.23.2922.258.2.331362e3d.273.2.13.58.28e.2.2313673.2a9.2.13.8f.2c5.2.3332238aa.2e..2.23129c5.2fb.2.3332e38e..216.3.131fc.232.3.2333817.34d.3.13132.368.3.33322384e.384.3.2312969.39f.3.3332e3884.3ba.3.1319f.3d5.3.23338bb.3f1.3.131d6.3.c.4.3332238f1.327.4.23129.d.443.4.3332e3828.45e.4.13143.479.4.238335e.494.4.1317a.4b..4.338332295.4cb.4.23129b..4e6.4.338332ecc.4.2.5.131e7.41d.5.23833.2.538.5.1311e.539.5.331223639.56f.5.23.2954.58a.5.3312e367..5a6.5.13.8b.5c1.5.431363f3fa6.5dc.5.13.c1.5f7.5.53136223a3add.513.6.23.29f8.52e.6.32e313613.649.6.13.2e.664.6.231364a.68..6.13.65.69b.6.33136228..6b6.6.23.299c.6d2.6.331362eb7.6ed.6.13.d2.6.8.7.431363f3fed.623.7.13..9.73f.7.331362224.75a.7.23.293f.775.7.331362e5a.79..7.13.76.7ac.7.2313691.7c7.7.13.ac.7e2.7.3332238c8.7fe.7.23129e3.719.8.3332e38fe.734.8.13119.84f.8.2333834.86a.8.1315..886.8.33322386b.8a1.8.2312986.8bc.8.3332e38a2.8d8.8.131bd.8f3.8.23338d8.8.e.9.131f4.82a.9.3332238.f.945.9.231292a.96..9.3332e3846.97c.9.13161.997.9.238337c.9b2.9.13197.9cd.9.3383322b3.9e9.9.23129ce.9.4.a.338332ee9.91f.a.131.5.a3b.a.438333a3a2..a56.a.1313b.a9b.a.331362256.a8c.a.23.2972.aa8.a.331362e8d.ac3.a.13.a8.ade.a.23136c4.afa.a.13.df.a15.b.3313622fa.a3..b.23.2915.b4b.b.331362e31.b67.b.13.4c.b82.b.2313667.b9d.b.13.82.bb8.b.33136229e.bd4.b.23.29b9.bef.b.331362ed4.b.a.c.13.ef.b25.c.23136.b.c41.c.13.26.c5c.c.331362241.c77.c.23.295d.c93.c.531362e3f3f78.cae.c.13.93.cc9.c.431363d3dae.ce4.c.13.ca.c2a.d.53c3.35223ce5.c1b.d.22e29...d36.d.33.352e1b.d36.d.12e37.d6d.d.23.3552.d88.d.12e6d.da3.d.53.35223c3c88.dbe.d.22e29a4.dda.d.53.352e3d3dbf.dda.d.12eda.d1..e.43.353f3ff6.d2c.e.12e11.e47.e.53.35223c3c2c.e62.e.22e2947.e7d.e.33.352e63.e7e.e.12e7e.eb4.e.23.3599.ecf.e.12eb4.eea.e.53.22353a3ad..e.6.f.22e29eb.e21.f.33.2e35.6.f21.f.12e22.f58.f.23.353d.f58.f.12e....1c...1.a..64..f4.164.....4...........................5.....7f9..37..6d...411.511.56d..a3...2.f.fa4..da...2.a.a7e.1b4.1.411.511.5b4.1ea.1.2.f.feb.121.2.414.814.858.28e.2.412.612.68f.2c5.2.411.511.554.58a.5.411.511.58b.5c1.5.2.f.fc1.5f7.5.2.a.a9c.6d2.6.411.511.5d2.6.8.7.2.f.f.9.73f.7.414.814.876.7ac.7.412.612.6ac.7e2.7.411.511.5.5.a3b.a.2.a.a3b.a9b.a.411.511.5df.a15.b.411.511.515.b4b.b.412.612.64c.b82.b.414.814.882.bb8.b.411.511.526.c5c.c.411.511.55d.c93.c.2.f.f93.cc9.c.2.d.dca.c2a.d.2.c.c6d.da3.d.2.c.ca4.dda.d.2.d.dda.d1..e.2.f.f11.e47.e.2.c.cb4.eea.e.2.a.a
""")])

def on_on_update():
    if _gameRunning:
        if _class == "knight":
            if _specialAttacking:
                _specialWeapon.bottom = _thePlayer.top + 20
                _specialWeapon.x = _thePlayer.x
            if _attacking:
                _weapon.bottom = _thePlayer.top
                _weapon.x = _thePlayer.x
        elif _class == "archer":
            pass
        elif _class == "mage":
            pass
game.on_update(on_on_update)

def on_on_update2():
    global _scoreCounter, _stage, _EnemySpeedMod, _enemyHealthMod, _WeaponUpgraded, _playerLevel
    if _gameRunning:
        if info.score() <= _scoreCounter:
            _scoreCounter += 5
            if info.score() >= _stageScore[_stage - 1]:
                music.play(music.melody_playable(music.ba_ding),
                    music.PlaybackMode.IN_BACKGROUND)
                freeze()
                sprites.destroy_all_sprites_of_kind(SpriteKind.enemy)
                sprites.destroy_all_sprites_of_kind(SpriteKind.EnemyProjectile)
                sprites.destroy_all_sprites_of_kind(SpriteKind.PlayerProjectile)
                _stage += 1
                _EnemySpeedMod += 0.08
                _enemyHealthMod += 0.09
                music.stop_all_sounds()
                if _stage == 2:
                    music.play(music.melody_playable(music.beam_up),
                        music.PlaybackMode.IN_BACKGROUND)
                    tiles.set_current_tilemap(tilemap("""
                        stage2
                    """))
                    color.start_fade(color.original_palette, color.black, 1000)
                    pause(1000)
                    color.start_fade(color.black, color.original_palette, 1000)
                    music.set_volume(20)
                    music.play(music.create_song(assets.song("""
                            level1song
                        """)),
                        music.PlaybackMode.LOOPING_IN_BACKGROUND)
                    music.set_volume(255)
                    _thePlayer.set_position(80, 105)
                elif _stage == 3:
                    music.play(music.melody_playable(music.beam_up),
                        music.PlaybackMode.IN_BACKGROUND)
                    tiles.set_current_tilemap(tilemap("""
                        stage3
                    """))
                    color.start_fade(color.original_palette, color.black, 1000)
                    pause(1000)
                    color.start_fade(color.black, color.original_palette, 1000)
                    music.set_volume(20)
                    music.play(music.create_song(assets.song("""
                            level1song
                        """)),
                        music.PlaybackMode.LOOPING_IN_BACKGROUND)
                    music.set_volume(255)
                    _thePlayer.set_position(80, 105)
                elif _stage == 4:
                    music.play(music.melody_playable(music.beam_up),
                        music.PlaybackMode.IN_BACKGROUND)
                    tiles.set_current_tilemap(tilemap("""
                        stage4
                    """))
                    color.start_fade(color.original_palette, color.black, 1000)
                    pause(1000)
                    color.start_fade(color.black, color.original_palette, 1000)
                    music.set_volume(20)
                    music.play(music.create_song(assets.song("""
                            level1song
                        """)),
                        music.PlaybackMode.LOOPING_IN_BACKGROUND)
                    music.set_volume(255)
                    _thePlayer.set_position(80, 105)
                elif _stage == 5:
                    music.play(music.melody_playable(music.beam_up),
                        music.PlaybackMode.IN_BACKGROUND)
                    tiles.set_current_tilemap(tilemap("""
                        stage5
                    """))
                    color.start_fade(color.original_palette, color.black, 1000)
                    pause(1000)
                    color.start_fade(color.black, color.original_palette, 1000)
                    music.set_volume(20)
                    music.play(music.create_song(assets.song("""
                            level1song
                        """)),
                        music.PlaybackMode.LOOPING_IN_BACKGROUND)
                    music.set_volume(255)
                    _thePlayer.set_position(80, 105)
                unfreeze()
            if info.score() >= _levelupScore[_playerLevel - 1]:
                _playerExperience.max = 20
                _playerExperience.value = 0
                if _playerLevel == 5:
                    _WeaponUpgraded = True
                    game.splash("WEAPON LEVEL UP!")
                music.play(music.melody_playable(music.ba_ding),
                    music.PlaybackMode.IN_BACKGROUND)
                freeze()
                _playerLevel += 1
                game.splash("LEVEL UP!")
                levelUp()
game.on_update(on_on_update2)

def on_forever():
    global _enemyBatHealthBar, _enemyBat
    if _gameRunning:
        _enemyBatHealthBar = statusbars.create(20, 3, StatusBarKind.enemy_health)
        _enemyBatHealthBar.set_color(7, 2, 3)
        _enemyBatHealthBar.set_bar_border(1, 14)
        if _stage == 1:
            _enemyBat = sprites.create(assets.image("""
                enemy2
            """), SpriteKind.enemy)
            animation.run_image_animation(_enemyBat,
                assets.animation("""
                    bat_animation
                """),
                250,
                False)
            _enemyBatHealthBar.attach_to_sprite(_enemyBat)
            statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, _enemyBat).max = 100 * _enemyHealthMod
            _enemyBat.set_flag(SpriteFlag.BOUNCE_ON_WALL, True)
            _enemyBat.set_position(randint(scene.screen_width() / 9, scene.screen_width() / 9 * 8),
                0)
            _enemyBat.set_velocity([-25, 25]._pick_random(), 15 * _EnemySpeedMod)
            _enemyBat.set_flag(SpriteFlag.AUTO_DESTROY, True)
            pause(6000)
        elif _stage == 2:
            _enemyBat = sprites.create(assets.image("""
                enemy2
            """), SpriteKind.enemy)
            animation.run_image_animation(_enemyBat,
                assets.animation("""
                    bat_animation
                """),
                250,
                False)
            _enemyBatHealthBar.attach_to_sprite(_enemyBat)
            statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, _enemyBat).max = 100 * _enemyHealthMod
            _enemyBat.set_flag(SpriteFlag.BOUNCE_ON_WALL, True)
            _enemyBat.set_position(randint(scene.screen_width() / 9, scene.screen_width() / 9 * 8),
                0)
            _enemyBat.set_velocity([-30, 30]._pick_random(), 15 * _EnemySpeedMod)
            _enemyBat.set_flag(SpriteFlag.AUTO_DESTROY, True)
            pause(5000)
        elif _stage == 3:
            _enemyBat = sprites.create(assets.image("""
                enemy2
            """), SpriteKind.enemy)
            animation.run_image_animation(_enemyBat,
                assets.animation("""
                    bat_animation
                """),
                250,
                False)
            _enemyBatHealthBar.attach_to_sprite(_enemyBat)
            statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, _enemyBat).max = 100 * _enemyHealthMod
            _enemyBat.set_flag(SpriteFlag.BOUNCE_ON_WALL, True)
            _enemyBat.set_position(randint(scene.screen_width() / 9, scene.screen_width() / 9 * 8),
                0)
            _enemyBat.set_velocity([-30, 30]._pick_random(), 20 * _EnemySpeedMod)
            _enemyBat.set_flag(SpriteFlag.AUTO_DESTROY, False)
            pause(4000)
        elif _stage == 4:
            _enemyBat = sprites.create(assets.image("""
                enemy2
            """), SpriteKind.enemy)
            animation.run_image_animation(_enemyBat,
                assets.animation("""
                    bat_animation
                """),
                250,
                False)
            _enemyBatHealthBar.attach_to_sprite(_enemyBat)
            statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, _enemyBat).max = 100 * _enemyHealthMod
            _enemyBat.set_flag(SpriteFlag.BOUNCE_ON_WALL, True)
            _enemyBat.set_position(randint(scene.screen_width() / 9, scene.screen_width() / 9 * 8),
                0)
            _enemyBat.set_velocity([-30, 30]._pick_random(), 20 * _EnemySpeedMod)
            pause(3000)
            _enemyBat.set_flag(SpriteFlag.AUTO_DESTROY, False)
        elif _stage == 5:
            pass
forever(on_forever)

def on_forever2():
    global _enemySkeletonHealthBar, _enemySkeleton, _skeletonSpeedBase
    if _gameRunning:
        _enemySkeletonHealthBar = statusbars.create(20, 3, StatusBarKind.enemy_health)
        _enemySkeletonHealthBar.set_color(7, 2, 3)
        _enemySkeletonHealthBar.set_bar_border(1, 14)
        if _stage == 1:
            _enemySkeleton = sprites.create(assets.image("""
                enemy1
            """), SpriteKind.enemy)
            animation.run_image_animation(_enemySkeleton,
                assets.animation("""
                    skeleton_animation
                """),
                500,
                True)
            _enemySkeletonHealthBar.attach_to_sprite(_enemySkeleton)
            statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, _enemySkeleton).max = 50 * _enemyHealthMod
            _enemySkeleton.set_position(randint(0, scene.screen_width()), 0)
            _skeletonSpeedBase = 20
            _enemySkeleton.follow(_thePlayer, _skeletonSpeedBase * _EnemySpeedMod)
            _enemySkeleton.set_flag(SpriteFlag.AUTO_DESTROY, True)
            pause(2000)
        elif _stage == 2:
            _enemySkeleton = sprites.create(assets.image("""
                enemy1
            """), SpriteKind.enemy)
            animation.run_image_animation(_enemySkeleton,
                assets.animation("""
                    skeleton_animation
                """),
                500,
                True)
            _enemySkeletonHealthBar.attach_to_sprite(_enemySkeleton)
            statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, _enemySkeleton).max = 50 * _enemyHealthMod
            _enemySkeleton.set_position(randint(0, scene.screen_width()), 0)
            _skeletonSpeedBase = 25
            _enemySkeleton.follow(_thePlayer, _skeletonSpeedBase * _EnemySpeedMod)
            _enemySkeleton.set_flag(SpriteFlag.AUTO_DESTROY, True)
            pause(2000)
        elif _stage == 3:
            _enemySkeleton = sprites.create(assets.image("""
                enemy1
            """), SpriteKind.enemy)
            animation.run_image_animation(_enemySkeleton,
                assets.animation("""
                    skeleton_animation
                """),
                500,
                True)
            _enemySkeletonHealthBar.attach_to_sprite(_enemySkeleton)
            statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, _enemySkeleton).max = 50 * _enemyHealthMod
            _enemySkeleton.set_position(randint(0, scene.screen_width()), 0)
            _skeletonSpeedBase = 30
            _enemySkeleton.follow(_thePlayer, _skeletonSpeedBase * _EnemySpeedMod)
            _enemySkeleton.set_flag(SpriteFlag.AUTO_DESTROY, True)
            pause(2000)
        elif _stage == 4:
            _enemySkeleton = sprites.create(assets.image("""
                enemy1
            """), SpriteKind.enemy)
            animation.run_image_animation(_enemySkeleton,
                assets.animation("""
                    skeleton_animation
                """),
                500,
                True)
            _enemySkeletonHealthBar.attach_to_sprite(_enemySkeleton)
            statusbars.get_status_bar_attached_to(StatusBarKind.enemy_health, _enemySkeleton).max = 50 * _enemyHealthMod
            _enemySkeleton.set_position(randint(0, scene.screen_width()), 0)
            _skeletonSpeedBase = 35
            _enemySkeleton.follow(_thePlayer, _skeletonSpeedBase * _EnemySpeedMod)
            pause(2000)
            _enemySkeleton.set_flag(SpriteFlag.AUTO_DESTROY, True)
        elif _stage == 5:
            pass
forever(on_forever2)

def on_forever3():
    global _enemyBatProjectile
    while not (spriteutils.is_destroyed(_enemyBat)) and _gameRunning:
        _enemyBatProjectile = sprites.create(assets.image("""
                enemyProjectile
            """),
            SpriteKind.EnemyProjectile)
        _enemyBatProjectile.set_position(_enemyBat.x, _enemyBat.y)
        _enemyBatProjectile.set_velocity(0, 50)
        _enemyBatProjectile.set_flag(SpriteFlag.AUTO_DESTROY, True)
        _enemyBatProjectile.set_flag(SpriteFlag.DESTROY_ON_WALL, True)
        pause(2000)
forever(on_forever3)

def on_update_interval():
    if _gameRunning:
        _playerEnergy.value += 1
game.on_update_interval(500, on_update_interval)
