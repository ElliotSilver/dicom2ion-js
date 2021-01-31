const getVR = require('./getVR')

const attrStringDataToIon = (dataSet, attr) => {
    return dataSet.string(attr.tag)
}

const attrBinaryToIon = (dataSet, attr) => {
    return new Uint8Array(dataSet.byteArray.slice(attr.dataOffset, attr.dataOffset + attr.length))
}

const attrSSDataToIon = (dataSet, attr) => {
    if(attr.length > 2) {
        return attrBinaryToIon(dataSet, attr)
    } else {
        return dataSet.int16(attr.tag)
    }
}

const attrUSDataToIon = (dataSet, attr) => {
    if(attr.length > 2) {
        return attrBinaryToIon(dataSet, attr)
    } else {
        return dataSet.uint16(attr.tag)
    }
}

const attrSLDataToIon = (dataSet, attr) => {
    if(attr.length > 4) {
        return attrBinaryToIon(dataSet, attr)
    } else {
        return dataSet.int32(attr.tag)
    }
}

const attrULDataToIon = (dataSet, attr) => {
    if(attr.length > 2) {
        return attrBinaryToIon(dataSet, attr)
    } else {
        return dataSet.uint16(attr.tag)
    }
}

const attrFLDataToIon = (dataSet, attr) => {
    if(attr.length > 4) {
        return attrBinaryToIon(dataSet, attr)
    } else {
        return dataSet.float(attr.tag)
    }
}
const attrFDDataToIon = (dataSet, attr) => {
    if(attr.length > 8) {
        return attrBinaryToIon(dataSet, attr)
    } else {
        return dataSet.double(attr.tag)
    }
}

const attrDataRefToIon = (dataSet, attr) => {

    return {
        dataOffset: attr.dataOffset,
        length: attr.length,
        vr: attr.vr
    }   
}

const attrATDataToIon = (dataSet, attr) => {
    const group = dataSet.uint16(attr.tag, 0)
    const groupHexStr = ("0000" + group.toString(16)).substr(-4)
    const element = dataSet.uint16(attr.tag, 1)
    const elementHexStr = ("0000" + element.toString(16)).substr(-4)
    return groupHexStr + elementHexStr
}

const attrDataToIon = (dataSet, attr) => {
    if(attr.length == 0) {
        return null
    }
    const vr = getVR(attr)
    switch(vr) {
        case 'AE': 
        case 'AS': 
            return attrStringDataToIon(dataSet, attr)
        case 'AT': 
            return attrATDataToIon(dataSet, attr)
        case 'CS': 
        case 'DA': 
        case 'DS': 
        case 'DT': 
            return attrStringDataToIon(dataSet, attr)
        case 'FL':
            return attrFLDataToIon(dataSet, attr)
        case 'FD':
            return attrFDDataToIon(dataSet, attr)
        case 'IS': 
        case 'LO': 
        case 'LT': 
            return attrStringDataToIon(dataSet, attr)
        case 'OB':
        case 'OF':
        case 'OW':
            return attrBinaryToIon(dataSet, attr)
        case 'PN': 
        case 'SH': 
            return attrStringDataToIon(dataSet, attr)
        case 'SL':
            return attrSLDataToIon(dataSet, attr)
        case 'SS':
            return attrSSDataToIon(dataSet, attr)
        case 'ST': 
        case 'TM': 
        case 'UI': 
            return attrStringDataToIon(dataSet, attr)
        case 'UL':
            return attrULDataToIon(dataSet, attr)
        case 'UN':
            return attrBinaryToIon(dataSet, attr)
        case 'US':
            return attrUSDataToIon(dataSet, attr)
        case 'UT': 
            return attrStringDataToIon(dataSet, attr)
        default:
            return attrDataRefToIon(dataSet, attr)
    }
}

const attrToIon = (dataSet, attr) => {
    if(attr.items) {
        // sequnces
    } else {
        // non sequence item
        if(attr.length < 256) {
            return attrDataToIon(dataSet, attr)
        } else {
            return attrDataRefToIon(dataSet, attr)
        }
    }
}
module.exports = attrToIon