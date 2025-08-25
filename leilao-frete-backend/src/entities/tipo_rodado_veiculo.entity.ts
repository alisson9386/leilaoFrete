import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'tipo_rodado_veiculo'})
export class TipoRodadoVeiculo {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    tipo_rodado: string

    @Column({default: true})
    fl_ativo: boolean
}

