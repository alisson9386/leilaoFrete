import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'locais_coleta' })
export class LocaisColeta {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;

  @Column()
  endereco: string;

  @Column()
  numero: number;

  @Column()
  complemento: string;

  @Column()
  bairro: string;

  @Column()
  cep: number;

  @Column()
  cidade: string;

  @Column()
  uf: number;
}
