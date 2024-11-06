export function validateCPF(cpf: string): boolean {
    try {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        const digits: number[] = [...cpf].map(Number);

        let total: number = 0;
        for (let i: number = 0; i < 9; i++) {
            total += digits[i] * (10 - i);
        }
        let firstVerifier: number = (total * 10) % 11;
        if (firstVerifier === 10) firstVerifier = 0;

        if (firstVerifier !== digits[9]) return false;

        total = 0;
        for (let i: number = 0; i < 10; i++) {
            total += digits[i] * (11 - i);
        }
        let secondVerifier: number = (total * 10) % 11;
        if (secondVerifier === 10) secondVerifier = 0;

        return secondVerifier === digits[10];
    } catch (error) {
        return false;
    }
}

export function validateCNPJ(cnpj: string): boolean {
    try {
        cnpj = cnpj.replace(/\D/g, '');

        if (cnpj.length !== 14) return false;
        if (/^(\d)\1{13}$/.test(cnpj)) return false;

        const digits: number[] = [...cnpj].map(Number);

        let total: number = 0;
        const firstMultiplier: number[] = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        for (let i: number = 0; i < 12; i++) {
            total += digits[i] * firstMultiplier[i];
        }
        let firstVerifier: number = total % 11;
        if (firstVerifier < 2) firstVerifier = 0;
        else firstVerifier = 11 - firstVerifier;

        if (firstVerifier !== digits[12]) return false;

        total = 0;
        const secondMultiplier: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        for (let i: number = 0; i < 13; i++) {
            total += digits[i] * secondMultiplier[i];
        }
        let secondVerifier: number = total % 11;
        if (secondVerifier < 2) secondVerifier = 0;
        else secondVerifier = 11 - secondVerifier;

        return secondVerifier === digits[13];
    } catch (error) {
        return false;
    }
}

export function toBRLCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
