import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'tipo_proprietario'})
export class TipoProprietario {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    tipo_proprietario: string

    @Column({default: true})
    fl_ativo: boolean
}
