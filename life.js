class Life {
    constructor(width = 50, height = 25) {
        this.width = width;
        this.height = height;
        this.grid = new Uint8Array(width * height);
    }
    xyToIndex(x, y) {
        return y*this.width + x;
    }
    indexToXY(index) {
        const x = index % this.width;
        const y = Math.floor(index / this.width);
        return { x, y };
    }

    #disambiguateLocation(...location) {
        let x, y;
        if (location.length === 1) {
            const xy = this.indexToXY(location[0]);
            x = xy.x;
            y = xy.y;
        } else [x, y] = location;

        return {x, y};
    }
    getGridCellNeighborIndexes(...location) {
        const {x, y} = this.#disambiguateLocation(location);

        const neighbors = [
            this.xyToIndex(x-1, y-1),
            this.xyToIndex(x, y-1),
            this.xyToIndex(x-1, y),
            this.xyToIndex(x+1, y),
            this.xyToIndex(x-1, y+1),
            this.xyToIndex(x, y+1),
            this.xyToIndex(x+1, y+1)
        ];
        return neighbors;
    }
    getGridCellLife(...location) {
        const {x, y} = this.#disambiguateLocation(location);
        const index = this.xyToIndex(x, y);

        if (this.grid[index] === 1)
            return true;
        else if (this.grid[index] === 0)
            return false;
        else return null;
    }
    setGridCellLife(living, ...location) {
        if (typeof living !== 'boolean')
            throw new TypeError('Living state must be a boolean.');

        const {x, y} = this.#disambiguateLocation(location);
        const index = this.xyToIndex(x, y);

        if (living)
            this.grid[index] = 1;
        else
            this.grid[index] = 0;
    }
    
    step() {
        const newGrid = new Uint8Array(this.grid);
        for (const [index, lifeNumber] of [...newGrid].entries()) {
            const neighbors = this.getGridCellNeighborIndexes(index);
            let aliveNeighbors = 0;
            for (const neighbor of neighbors) {
                if (this.getGridCellLife(neighbor))
                    aliveNeighbors++;
            }
            if (lifeNumber === 0) {
                if (aliveNeighbors === 3) newGrid[index] = 1;
            } else if (lifeNumber === 1) {
                if (
                    aliveNeighbors === 2 ||
                    aliveNeighbors === 3
                ) newGrid[index] = 1;
                else newGrid[index] = 1;
            }
        }
        this.grid = newGrid;
    }
}
/*function displayLife(life) {
    const lines = [];
    for (let y = 0; y < life.height; y++) {
        let lineStr = '';
        for (let x = 0; x < life.width; x++) {
            if (life.grid[life.xyToIndex(x,y)] === 1)
                lineStr += '.';
            else lineStr += '';
        }
    }
    console.log(lines.join('\n'));
} */