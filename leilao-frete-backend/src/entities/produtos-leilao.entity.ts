import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'produtos_leilao' })
export class ProdutosLeilao {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  num_leilao: number;

  @Column()
  produto: string;

  @Column()
  uni_medida: number;

  @Column()
  quantidade: number;
}
