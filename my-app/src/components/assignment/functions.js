const listLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const listNumbers = [1, 2, 3, 4, 5, 6, 7];

const startWith = (letter, team) => {
    if (team === 1) {
        switch (letter) {
            case 'A':
                return 1;
            case 'B':
                return 22;
            case 'C':
                return 43;
            case 'D':
                return 64;
            case 'E':
                return 85;
            case 'F':
                return 106;
            case 'G':
                return 127;
            default:
                break;
        }
    }
}

const arrayOptions = () => {
    listLetters.map((i) => {
        listNumbers.map((j) => {
            //console.log('(' + i + ',' + j + ')')
        });
    });
};