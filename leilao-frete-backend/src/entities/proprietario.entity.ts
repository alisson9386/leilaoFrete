import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'proprietario' })
export class Proprietario {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;

  @Column()
  cpf_cnpj: string;

  @Column()
  tel_whatsapp: string;

  @Column()
  ie: string;

  @Column()
  uf: number;
  
  @Column()
  tipo_proprietario: number;

  @Column({ default: true })
  fl_ativo: boolean;
}

