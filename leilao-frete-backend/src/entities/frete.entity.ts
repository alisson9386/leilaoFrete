import { Column, Double, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'frete' })
export class Frete {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  num_leilao: number;
  
  @Column()
  dt_abertura: Date;

  @Column()
  dt_validade_leilao: Date;

  @Column('double precision')
  vl_lance_maximo: number;

  @Column()
  num_ordem_coleta: number;

  @Column()
  dt_emissao_ordem: Date;

  @Column()
  dt_coleta_ordem: Date;

  @Column()
  dt_max_entrega: Date;

  @Column()
  local_origem: number;

  @Column()
  nm_ordem_venda: number;

  @Column()
  razao_social: string;

  @Column()
  cnpj: string;

  @Column()
  endereco_destino: string;

  @Column()
  bairro_destino: string;

  @Column()
  numero_destino: number;

  @Column()
  cep_destino: number;

  @Column()
  cidade_destino: string;

  @Column()
  uf: number;

  @Column()
  ie: number;

  @Column()
  status: number;
}
