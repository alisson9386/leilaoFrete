import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'freteiro' })
export class Freteiro {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;

  @Column()
  cpf: string;

  @Column()
  modelo_veiculo: string;

  @Column()
  placa: string;

  @Column()
  tel_whatsapp: string;

  @Column({ default: true })
  fl_ativo: boolean;
}

