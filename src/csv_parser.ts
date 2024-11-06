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
            const formattedMora = toBRLCurrency(parseFloat(item.vlMora));
            const formattedMulta = toBRLCurrency(parseFloat(item.vlMulta));
            const formattedIof = toBRLCurrency(parseFloat(item.vlIof));
            const formattedDescon = toBRLCurrency(parseFloat(item.vlDescon));
            const formattedAtual = toBRLCurrency(parseFloat(item.vlAtual));
            

            return {
                "baseData" : {
                    ...item,
                },
                "validatedData" : {
                    isCpfValid,
                    isCnpjValid,
                    isPrestacaoValid,
                    formattedTotal,
                    formattedPrestacao,
                    formattedMora,
                    formattedMulta,
                    formattedIof,
                    formattedDescon,
                    formattedAtual,
                },
            };
        } catch (error : any) {
            return {
                "baseData" : {
                    ...item,
                },
                "validatedData" : {
                    "isCpfValid" : false,
                    "isCnpjValid" : false,
                    "isPrestacaoValid" : false,
                    "formattedTotal" : "error",
                    "formattedPrestacao" : "error",
                    "formattedMora" : "error",
                    "formattedMulta" : "error",
                    "formattedIof" : "error",
                    "formattedDescon" : "error",
                    "formattedAtual" : "error",
                },
                "error" : error.message,
            };
        }

    });

    return results;
}