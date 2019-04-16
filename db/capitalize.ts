export class Capitalize {
    /**
     * Transform take value with capitalize first or all words to complete input string
     * @param input Text value with name and lastname
     * @param all Capitalize Name and lastname boolean option
     */
    transform(input: string, all: boolean = false): string {
        if (all && input !== undefined) {
            const words = input.split(' ');
            if (words.length === 1) {
                return this.getUppercaseFirtsLetter(words[0]).trim();
            }
            let valueFinal = '';
            words.map(
                word => valueFinal = valueFinal + ' ' + this.getUppercaseFirtsLetter(word)
            )
            return valueFinal.trim();
        }
        return !!input ?  this.getUppercaseFirtsLetter(input).trim() : '';
    }

    private getUppercaseFirtsLetter(input: string) {
        return input
            .charAt(0)
            .toUpperCase() + input.substr(1).toLowerCase();
    }
}
    