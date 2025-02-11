export const GAME_SETTINGS = {
    TITLE: 'GitHub Guardians',
    VERSION: '1.0.0',
    IS_PAUSED: false,
    IS_DEBUG: false,
    IS_FULLSCREEN: false,
    IS_MOBILE: false,
    IS_CONTEXT_MENU_DISABLED: false,
} as const;

export const VIEWPORT_CONSTANTS = {
    MIN: {
        WIDTH: 320,
        HEIGHT: 180
    },
    MAX: {
        WIDTH: 1290,
        HEIGHT: 1080
    },
    ZOOM: 1
} as const;

export const PLAYER_CONSTANTS = {
    MOVEMENT_SPEED: 300,
    ANIMATION_FRAME_RATE: 5
} as const;