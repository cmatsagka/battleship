export function ship(length, hits = null, sunk = false) {
	hits = hit(hits);
	sunk = isSunk(length, hits);
	return { length, hits, sunk };
}

const hit = (hits) => {
	return hits++;
};

const isSunk = (length, hits) => {
	if (hits === length) return true;
	return false;
};
