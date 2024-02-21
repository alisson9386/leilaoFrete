import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;

  @Column()
  usuario: string;

  @Column()
  senha: string;

  @Column()
  email: string;

  @Column({ default: true })
  fl_ativo: boolean;
}
