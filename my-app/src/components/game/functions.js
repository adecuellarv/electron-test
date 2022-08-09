const listLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
const listNumbers = [1, 2, 3, 4, 5, 6, 7];

const arrayOptions = () => {
    listLetters.map((i) => {
        listNumbers.map((j) => {
            console.log('(' + i + ',' + j + ')')
        });
    });
};