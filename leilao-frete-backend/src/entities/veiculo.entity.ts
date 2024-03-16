import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'veiculo'})
export class Veiculo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  placa: string;

  @Column()
  rntc: number;

  @Column()
  tara_kg: number;

  @Column()
  capacidade_kg: number;

  @Column()
  capacidade_m3: number;

  @Column()
  capacidade_litros: number;

  @Column()
  uf_veiculo_licenciado: number;

  @Column()
  tipo_rodado: number;

  @Column()
  tipo_carroceria: number;

  @Column()
  veiculo_proprio: boolean;

  @Column({ default: true })
  fl_ativo: boolean;
}
