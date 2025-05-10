// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_true_the_initiative.sql';
import m0001 from './0001_amused_shaman.sql';
import m0002 from './0002_great_warbird.sql';
import m0003 from './0003_amazing_skreet.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003
    }
  }
  