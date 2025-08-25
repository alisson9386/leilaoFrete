import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lances_frete' })
export class LancesFrete {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('double precision')
  num_leilao: number;

  @Column()
  valor_lance: number;

  @Column()
  wp_lance: string;

  @Column()
  oferta_vencedora: number;
}
