import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'uni_medida' })
export class UnidadeMedida {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  uni_medida: string;
}
