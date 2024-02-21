import { DataSourceOptions } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Freteiro } from './entities/freteiro.entity';

export const config: DataSourceOptions = {
  type: 'sqlite',
  database: '.db/sql',
  synchronize: true, // Obs: use synchronize: true somente em desenvolvimento.
  entities: [Usuario, Freteiro],
};
