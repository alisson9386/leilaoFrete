import { DataSourceOptions } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Proprietario } from './entities/proprietario.entity';

export const config: DataSourceOptions = {
  type: 'sqlite',
  database: '.db/sql',
  synchronize: true, // Obs: use synchronize: true somente em desenvolvimento.
  entities: [Usuario, Proprietario],
};
