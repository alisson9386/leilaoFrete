import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'tipo_carroceria_veiculo'})
export class TipoCarroceriaVeiculo {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    tipo_carroceria: string

    @Column({default: true})
    fl_ativo: boolean
}
