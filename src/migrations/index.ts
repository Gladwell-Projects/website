import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20251006_182114 from './20251006_182114';
import * as migration_20251008_193323 from './20251008_193323';
import * as migration_20251010_221259 from './20251010_221259';
import * as migration_20251013_170536 from './20251013_170536';
import * as migration_20251013_183510 from './20251013_183510';
import * as migration_20251013_192503 from './20251013_192503';
import * as migration_20251013_204419 from './20251013_204419';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20251006_182114.up,
    down: migration_20251006_182114.down,
    name: '20251006_182114',
  },
  {
    up: migration_20251008_193323.up,
    down: migration_20251008_193323.down,
    name: '20251008_193323',
  },
  {
    up: migration_20251010_221259.up,
    down: migration_20251010_221259.down,
    name: '20251010_221259',
  },
  {
    up: migration_20251013_170536.up,
    down: migration_20251013_170536.down,
    name: '20251013_170536',
  },
  {
    up: migration_20251013_183510.up,
    down: migration_20251013_183510.down,
    name: '20251013_183510',
  },
  {
    up: migration_20251013_192503.up,
    down: migration_20251013_192503.down,
    name: '20251013_192503',
  },
  {
    up: migration_20251013_204419.up,
    down: migration_20251013_204419.down,
    name: '20251013_204419'
  },
];
