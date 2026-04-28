export function ship(length) {
	let hitsCount = 0;

	return {
		length,
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
