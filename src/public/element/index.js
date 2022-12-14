const originalLetters = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
];
const outputLetters = [
	'๐ฐ',
	'๐ฑ',
	'๐ฒ',
	'๐ณ',
	'๐ด',
	'๐ต',
	'๐ถ',
	'๐ท',
	'๐ธ',
	'๐น',
	'๐บ',
	'๐ป',
	'๐ผ',
	'๐ฝ',
	'๐พ',
	'๐ฟ',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐',
	'๐ ',
	'๐ก',
	'๐ข',
	'๐ฃ',
];

const numbers = ['โฐ', 'ยน', 'ยฒ', 'ยณ', 'โด', 'โต', 'โถ', 'โท', 'โธ', 'โน'];

const element = document.getElementById('element');
const generateButton = document.getElementById('generate');
const output = document.getElementById('output');
const copyButton = document.getElementById('copy');
const outputContainer = document.getElementById('output-container');

window.onload = async () => {
	const data = await fetch('https://neelpatel05.pythonanywhere.com/');
	const res = await data.json();
	res
		.map((i) => i.name)
		.sort()
		.forEach((el) => {
			element.add(new Option(el));
		});
	generateButton.onclick = () => {
        outputContainer.classList.remove('hidden');
		const name = document.getElementById('element').value;
		const atomicNumber = res.find((el) => el.name == name).atomicNumber;

		output.value =
			name
				.split('')
				.map((letter) => {
					return outputLetters[originalLetters.indexOf(letter)];
				})
				.join('') +
			atomicNumber
				.toString()
				.split('')
				.map((number) => {
					return numbers[number];
				})
				.join('');
	};
	copyButton.onclick = () => {
		output.select();
		output.setSelectionRange(0, 99999);
		navigator.clipboard.writeText(output.value);
	};
};
