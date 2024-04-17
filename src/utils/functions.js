const fs = require("fs")
const path = require("path");

let dataList = []

async function getAll(relativePath, limit = 0) {
    try {
        const absolutePath = path.resolve(__dirname, relativePath);
        const data = await fs.promises.readFile(absolutePath, 'utf-8')
        dataList = JSON.parse(data)
        if(limit > 0){
            return dataList.slice(0, limit)
        }
        return dataList
    } catch (error) {
        return dataList
    }
}

module.exports = {getAll}