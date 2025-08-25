import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'frete_veiculo_quantidade' })
export class FreteVeiculoQuantidade {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  num_leilao: number;

  @Column()
  id_tipo_veiculo: number;

  @Column()
  id_tipo_carroceria: number;

  @Column()
  quantidade: number;
}
