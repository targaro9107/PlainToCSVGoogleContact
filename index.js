const fs = require('fs');
//Archivo de entrada de texto Plano de contactos
// 54822000
// Grisel

// 53491811
// Betty Talla S

// 53992116
// Idanneris

//Archivo de Salida CSV Google Contacts
//Name,Given Name,Additional Name,Family Name,Yomi Name,Given Name Yomi,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Language,Photo,Group Membership,Phone 1 - Type,Phone 1 - Value,Organization 1 - Type,Organization 1 - Name,Organization 1 - Yomi Name,Organization 1 - Title,Organization 1 - Department,Organization 1 - Symbol,Organization 1 - Location,Organization 1 - Job Description
//Grisel,,,,,,,Grisel,,,,,,,,,,,,,,,,,* myContacts,Mobile,54822000,,,,,,,,,,,,
//Betty Talla S,,,,,,,Betty Talla S,,,,,,,,,,,,,,,,,* myContacts,Mobile,53491811,,,,,,,,,,,,
//Idanneris,,,,,,,Idanneris,,,,,,,,,,,,,,,,,* myContacts,Mobile,53992116,,,,,,,,,,,,

function plainToCSV(file) {
    var array = fs.readFileSync(file).toString().split("\n");
    var csv = 'Name,Given Name,Additional Name,Family Name,Yomi Name,Given Name Yomi,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Language,Photo,Group Membership,Phone 1 - Type,Phone 1 - Value,Organization 1 - Type,Organization 1 - Name,Organization 1 - Yomi Name,Organization 1 - Title,Organization 1 - Department,Organization 1 - Symbol,Organization 1 - Location,Organization 1 - Job Description\n';

    let result = parseNameAndCel(array, 0)
    const line = lineCSV(result)
    console.log(line)
    csv += line + '\n'
    while (result.nextIndex < array.length) {
        result = parseNameAndCel(array, result.nextIndex)
        
        const line = lineCSV(result)
        console.log(line)
        csv += line + '\n'
    }

    fs.writeFileSync('contacts.csv', csv);
}

function limpiarCadena(cadena) {
    // Eliminar espacios en los extremos
    cadena = cadena.trim();

    // Eliminar salto de línea al final
    if (cadena.endsWith('\n')) {
        cadena = cadena.slice(0, -1);
    }
    if (cadena.endsWith('\r')) {
        cadena = cadena.slice(0, -1);
    }

    return cadena;
}
function lineCSV(object) {
    if (object.cel.length > 0)
        return `${object.name},,,,,,,${object.name},,,,,,,,,,,,,,,,,* myContacts,Mobile,${object.cel},,,,,,,,,,,,`
    else
        return ''

}

function parseNameAndCel(array, index) {
    try {

        //correr index cuando se un espacio o tabulador

        index = consumirTab(array, index)
        var cel = array[index];
        //verificar si es un numero de celular
        if (parseInt(cel) == NaN)
            throw new Error('No es un numero de celular');

        index = consumirTab(array, index)
        var name = array[index + 1];
        const p = parseInt(name)
        if (name.length == 0 || p == NaN)
            throw new Error('No es un nombre valido');
        const nextIndex = index + 2;
        name = limpiarCadena(name)
        cel = limpiarCadena(cel)
        return { name, cel, nextIndex };

    } catch (error) {
        return { name: '', cel: '', nextIndex: index + 1 };

    }
}

function consumirTab(array, index) {
    let nextIndex = index
    for (let i = index; i < array.length; i++) {
        const element = array[i];
        if (element.length < 3)
            nextIndex = i + 1
        else
            return nextIndex

    }

    return nextIndex

}

plainToCSV("plain.txt")

