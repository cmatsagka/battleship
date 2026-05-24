export function ship(length, name = 'Unknown Ship') {
	let hitsCount = 0;

	return {
		length,
		name,
		hit() {
			hitsCount++;
		},
		isSunk() {
			return hitsCount >= length;
		},
		getHits() {
			return hitsCount;
		},
	};
}
