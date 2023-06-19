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
const prefijoNombre = "Cliente"
const SufijoNombreAutoNum = 3 //Establecer en 0 lo desabilita

const mapContacts = {}


function plainToCSV(file) {
    var array = fs.readFileSync(file).toString().split("\n");
    var csv = 'Name,Given Name,Additional Name,Family Name,Yomi Name,Given Name Yomi,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Language,Photo,Group Membership,Phone 1 - Type,Phone 1 - Value,Organization 1 - Type,Organization 1 - Name,Organization 1 - Yomi Name,Organization 1 - Title,Organization 1 - Department,Organization 1 - Symbol,Organization 1 - Location,Organization 1 - Job Description\n';
    let result=undefined
    do {
        const index=result?result.nextIndex:0
        result = parseNameAndCel(array, index)
        const exist=mapContacts[result.cel]
        if (!exist && result.cel.length >= 6) {
            const line = lineCSV(result)
            console.log(line)
            csv += line + '\n'

            mapContacts[result.cel]=true
            
        }



    } while (result.nextIndex < array.length)


    console.log(`\n\n ************** ${Object.keys(mapContacts).length} CONTACTOS LISTOS **************`)

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
        return `${object.name},,,,,,,${object.name},,,,,,,,,,,,,,,,,,,,,* myContacts,Mobile,${object.cel},,,,,,,,`
    else
        return ''

}

//Remove space "667 2232 990" to "6672232990"
function cleanCel(cadena) {
    return cadena.replace(/[\s()\-]+/g, '')
}

function parseNameAndCel(array, index) {
    try {

        const regex=/^\+?\d{0,3}\d{5,8}$/

        //correr index cuando se un espacio o tabulador

        index = consumirTab(array, index)
        var cel = array[index];
        cel = cleanCel(cel)
        //verificar si es un numero de celular
        if (!regex.test(cel))
            throw new Error('No es un numero de celular');

        index = consumirTab(array, index)
        var name = array[index + 1];
        const p = parseInt(name)
        if (name.length == 0 || p == NaN)
            throw new Error('No es un nombre valido');
        const nextIndex = index + 2;
        name = limpiarCadena(name)
        name = name.replace("~", "")
        cel = limpiarCadena(cel)

        name = prefijoNombre + " " + name + cel.substring(cel.length - SufijoNombreAutoNum, cel.length)
        


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

