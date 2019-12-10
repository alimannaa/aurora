import Vector2 from 'phaser/src/math/Vector2'

export default class levelGenerator{
    constructor(w, h, N, L){
        this.w = w,
        this.h = h,
        this.N = N,
        this.L = L
    }

    generateLevel(){
        let level = [];
        const w = this.w;
        const h = this.h;
        const N = this.N;
        const L = this.L;
        // map initialization
        for(let x = 0; x < w; x++){
            let column = [];
            for(let y = 0; y < h; y++){
                column.push(0);
            }
            level.push(column);
        }

        const startPosition = new Vector2(Phaser.Math.RND.integerInRange(0, w-1),
                            Phaser.Math.RND.integerInRange(0, h-1))
        level[startPosition.x][startPosition.y] = 2; // start position
        let currentPosition = startPosition.clone();
        let dir, vector, l;
        for(let n = 0; n < N; n++){
            do{
                l = Phaser.Math.RND.integerInRange(1, L);
                dir = this.getDirection();
                vector = dir.clone().scale(l).add(currentPosition);
            } while(!this.inMap(vector, w, h));
            this.createPath(currentPosition, vector, level, dir);
            currentPosition = vector;
        }
        level[startPosition.x][startPosition.y] = 2; // start position
        level[vector.x][vector.y] = 3; // end position
        return level;
    }

    createPath(currentPos, newPos, level, direction){
            let x = newPos.x;
            let y = newPos.y;
            let dx = direction.x > 0? -1 : 1;
            let dy = direction.y > 0? -1 : 1;

            while (x != currentPos.x){
                level[x][y] = 1;
                x+= dx;
            }
            while(y != currentPos.y){
                level[x][y] = 1;
                y += dy;
            }
    }

    inMap(vector, w, h){
        return vector.x >= 0 && vector.x < w && vector.y >= 0 && vector.y < h
    }

    getDirection(){
        let directions = [  Vector2.RIGHT,
                        Vector2.LEFT,
                        Vector2.UP,
                        Vector2.DOWN ]
        return directions[Phaser.Math.RND.integerInRange(0, 3)];
    }
}