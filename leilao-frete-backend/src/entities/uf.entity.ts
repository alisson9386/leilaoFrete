import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'uf'})
export class Uf {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    uf: string

    @Column({default: true})
    fl_ativo: boolean
}
