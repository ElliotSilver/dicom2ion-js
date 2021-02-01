const dataDictionary = require('./dataDictionary')

const getKeyword = (attr) => {
    // lookup the vr using the data dictionary
    const tag = attr.tag.substring(1).toUpperCase()
    const dataDictAttr = dataDictionary[tag]
    if(dataDictAttr) {
        return dataDictAttr.name
    }
    return tag
}

module.exports = getKeyword