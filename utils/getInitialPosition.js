const { ROW_COUNT } = require('../constants');

const getInitialPosition = (members = []) => {
    const rows = [];
    const size = ROW_COUNT;

    const initX = 40;
    const midPt = Math.ceil(size / 2) - 1;

    for (let i = 0; i < members.length; i += size) {
        const newRow = members.slice(i, i + size);
        rows.push(newRow);
    }

    rows.reverse().forEach((row, index) => {
        let inc = midPt;
        let dec = midPt;

        for (let i = 0; i < row.length; i++) {
            row[i] = {
                name: row[i],
                posX: initX * index + Math.floor(Math.random() * 25),
                posY: Math.floor(Math.random() * 50),
                y: i % 2 == 0 ? inc++ : --dec,
            };
        }
    });

    return rows.reverse().flat();
};

module.exports = { getInitialPosition };
