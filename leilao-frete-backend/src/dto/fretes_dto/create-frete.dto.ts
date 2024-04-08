import { Double } from "typeorm";

export class CreateFreteDto {
    num_leilao: number;
    dt_abertura: Date;
    dt_validade_leilao: Date;
    vl_lance_maximo: number;
    num_ordem_coleta: number;
    dt_emissao_ordem: Date;
    dt_coleta_ordem: Date;
    dt_max_entrega: Date;
    local_origem: number;
    nm_ordem_venda: number;
    razao_social: string;
    cnpj: string;
    endereco_destino: string;
    numero_destino: number;
    cep_destino: number;
    cidade_destino: string;
    uf: number;
    ie: number;
    status: number;
}
