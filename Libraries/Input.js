class Input
{
    static pressedKeys = {};

    //? Not used anymore ?//
    static reset()
    {
        Object.values(Keys).map(keyCode => {Input.pressedKeys[keyCode] = false;});
    }

    static onKeyDown(keyEvent)
    {
        Input.pressedKeys[keyEvent.keyCode] = true;
    }

    static onKeyUp(keyEvent)
    {
        Input.pressedKeys[keyEvent.keyCode] = false;

        for(let key in Input.pressedKeys)
        {
            if(key === true)
            {
                return;
            }
        }

        Input.stopRocketSound();
    }
    
    static getAWSD()
    {
        Input.keyboardTranslationVec3 = [0.0, 0.0, 0.0];

        if(Input.pressedKeys[Keys.KEY_A])
		{
            Input.keyboardTranslationVec3[0] += -0.02;
		}
        
        if(Input.pressedKeys[Keys.KEY_D])
		{
            Input.keyboardTranslationVec3[0] += 0.02;
		}
        
        if(Input.pressedKeys[Keys.KEY_W])
		{
            Input.keyboardTranslationVec3[2] += -0.02;
		}
        
        if(Input.pressedKeys[Keys.KEY_S])
		{
            Input.keyboardTranslationVec3[2] += 0.02;
		}

        if(Input.keyboardTranslationVec3[0] !== 0.0 || Input.keyboardTranslationVec3[2] !== 0.0)
            Input.playRocketSound();

        return Input.keyboardTranslationVec3;
    }
    
    static getQE()
    {
        Input.keyboardRotationAngle = 0.0;
        
        if(Input.pressedKeys[Keys.KEY_Q])
		{
            Input.keyboardRotationAngle += 0.002;
		}
        
        if(Input.pressedKeys[Keys.KEY_E])
		{
            Input.keyboardRotationAngle += -0.002;
		}

        if(Input.keyboardRotationAngle !== 0.0)
            Input.playRocketSound();

        return Input.keyboardRotationAngle;
    }

    static playRocketSound()
    {
		let rocket = document.getElementById('rocket');
		rocket.volume = 0.15;
		rocket.play();
    }

    static stopRocketSound()
    {
		let rocket = document.getElementById('rocket');
		rocket.pause();
    }
}

const Keys =
{
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS_LOCK: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    INSERT: 45,
    DELETE: 46,
    KEY_0: 48,
    KEY_1: 49,
    KEY_2: 50,
    KEY_3: 51,
    KEY_4: 52,
    KEY_5: 53,
    KEY_6: 54,
    KEY_7: 55,
    KEY_8: 56,
    KEY_9: 57,
    KEY_A: 65,
    KEY_B: 66,
    KEY_C: 67,
    KEY_D: 68,
    KEY_E: 69,
    KEY_F: 70,
    KEY_G: 71,
    KEY_H: 72,
    KEY_I: 73,
    KEY_J: 74,
    KEY_K: 75,
    KEY_L: 76,
    KEY_M: 77,
    KEY_N: 78,
    KEY_O: 79,
    KEY_P: 80,
    KEY_Q: 81,
    KEY_R: 82,
    KEY_S: 83,
    KEY_T: 84,
    KEY_U: 85,
    KEY_V: 86,
    KEY_W: 87,
    KEY_X: 88,
    KEY_Y: 89,
    KEY_Z: 90,
    LEFT_META: 91,
    RIGHT_META: 92,
    SELECT: 93,
    NUMPAD_0: 96,
    NUMPAD_1: 97,
    NUMPAD_2: 98,
    NUMPAD_3: 99,
    NUMPAD_4: 100,
    NUMPAD_5: 101,
    NUMPAD_6: 102,
    NUMPAD_7: 103,
    NUMPAD_8: 104,
    NUMPAD_9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBTRACT: 109,
    DECIMAL: 110,
    DIVIDE: 111,
    KEY_F1: 112,
    KEY_F2: 113,
    KEY_F3: 114,
    KEY_F4: 115,
    KEY_F5: 116,
    KEY_F6: 117,
    KEY_F7: 118,
    KEY_F8: 119,
    KEY_F9: 120,
    KEY_F10: 121,
    KEY_F11: 122,
    KEY_F12: 123,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    SEMICOLON: 186,
    EQUALS: 187,
    COMMA: 188,
    DASH: 189,
    PERIOD: 190,
    FORWARD_SLASH: 191,
    GRAVE_ACCENT: 192,
    OPEN_BRACKET: 219,
    BACK_SLASH: 220,
    CLOSE_BRACKET: 221,
    SINGLE_QUOTE: 222
};