import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tipo_usuarios' })
export class TipoUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  tipo: string;

  @Column({ default: true })
  fl_ativo: boolean;
}
