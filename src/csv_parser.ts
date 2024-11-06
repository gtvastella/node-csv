import fs from 'fs';
import csvParser from 'csv-parser';
import { validateCPF, validateCNPJ, toBRLCurrency } from './util';

export interface ParsedData {
    nrInst: string;
    nrAgencia: string;
    cdClient: string;
    nmClient: string;
    nrCpfCnpj: string;
    nrContrato: string;
    dtContrato: string;
    qtPrestacoes: string;
    vlTotal: string;
    cdProduto: string;
    dsProduto: string;
    cdCarteira: string;
    dsCarteira: string;
    nrProposta: string;
    nrPresta: string;
    tpPresta: string;
    nrSeqPre: string;
    dtVctPre: string;
    vlPresta: string;
    vlMora: string;
    vlMulta: string;
    vlOutAcr: string;
    vlIof: string;
    vlDescon: string;
    vlAtual: string;
    idSituac: string;
    idSitVen: string;
}

export function parseCSV(filePath: string): Promise<ParsedData[]> {
    return new Promise((resolve, reject) => {
        const results: ParsedData[] = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
    
}

export function validateData(data: ParsedData[]): Object {
    const results: Object = data.map((item) => {
        try {
            const cpfCnpj = item.nrCpfCnpj;
            const isCpfValid = validateCPF(cpfCnpj);
            const isCnpjValid = validateCNPJ(cpfCnpj);
            const total = parseFloat(item.vlTotal);
            const prestacao = parseFloat(item.vlPresta);
            const totalPrestacoes = parseInt(item.qtPrestacoes);
            const calculatedPrestacao = total / totalPrestacoes;
            const isPrestacaoValid = Math.abs(calculatedPrestacao - prestacao) < 0.01;
            const formattedTotal = toBRLCurrency(total);
            const formattedPrestacao = toBRLCurrency(prestacao);

            return {
                ...item,
                isCpfValid,
                isCnpjValid,
                isPrestacaoValid,
                formattedTotal,
                formattedPrestacao,
            };
        } catch (error) {
            return {
                ...item,
                isCpfValid: false,
                isCnpjValid: false,
                isPrestacaoValid: false,
                formattedTotal: 'R$ 0,00',
                formattedPrestacao: 'R$ 0,00',
            };
        }

    });

    return results;
}