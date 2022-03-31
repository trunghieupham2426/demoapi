const config = {
  type: 'mysql',
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*.ts', 'dist/src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(config, {
      synchronize: true, // chu y' khi  dung` cai nay o production, set = false
    });
    break;
  case 'test':
    Object.assign(config, {
      migrationsRun: true,
    });
    break;
  default:
    throw new Error('unknown environment');
}

module.exports = config;
