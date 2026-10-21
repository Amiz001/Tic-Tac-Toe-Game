/**
 * Extensible Avatar Registry.
 *
 * To add a new avatar to the game:
 * Simply append a new entry to the `AVATARS` array below.
 * Supports both image-based avatars (e.g. webp, png, svg) and symbol-based avatars (e.g. X, O).
 */

export const AVATARS = [
  {
    id: 'bug_red',
    name: 'Ruby Ladybug',
    type: 'image',
    src: '/images/bug_red.webp',
    accentColor: '#e63946',
  },
  {
    id: 'bug_yellow',
    name: 'Golden Ladybug',
    type: 'image',
    src: '/images/bug5.webp',
    accentColor: '#f1a208',
  },
  {
    id: 'bug_blue',
    name: 'Sapphire Ladybug',
    type: 'image',
    src: '/images/bug1.webp',
    accentColor: '#0066ff',
  },
  {
    id: 'bug_green',
    name: 'Emerald Ladybug',
    type: 'image',
    src: '/images/bug2.webp',
    accentColor: '#2bb62a',
  },
  {
    id: 'bug_pink',
    name: 'Rose Ladybug',
    type: 'image',
    src: '/images/bug3.webp',
    accentColor: '#ff66a3',
  },
  {
    id: 'bug_purple',
    name: 'Amethyst Ladybug',
    type: 'image',
    src: '/images/bug4.webp',
    accentColor: '#9b2226',
  },
  {
    id: 'classic_x',
    name: 'Jungle X',
    type: 'symbol',
    symbol: '✕',
    color: '#d9241b',
    accentColor: '#d9241b',
  },
  {
    id: 'classic_o',
    name: 'Jungle O',
    type: 'symbol',
    symbol: '◯',
    color: '#2bb62a',
    accentColor: '#2bb62a',
  },
];

/**
 * Retrieve avatar configuration by ID.
 * @param {string} id
 * @returns {typeof AVATARS[0]}
 */
export function getAvatarById(id) {
  return AVATARS.find((avatar) => avatar.id === id) || AVATARS[0];
}

/**
 * Default avatars matching the reference artwork:
 * Player 1: Ruby Ladybug (bug_red)
 * Player 2: Golden Ladybug (bug_yellow / bug5)
 */
export const DEFAULT_P1_AVATAR = 'bug_red';
export const DEFAULT_P2_AVATAR = 'bug_yellow';
