import requests
import libxml2
import scrap
import sys
import json

reload(sys)
sys.setdefaultencoding('utf-8')

schema = 'http://register.bulnao.government.bg/2013/'


def parseProperties(obj):
    result = dict()
    obj = obj.get_properties()
    while obj:
        result[str(obj).strip().split('=')[0]] = str(
            obj).strip().split('=')[1].replace('"', '')
        obj = obj.next
    return result


def parseRow(row):
    result = list()
    cell = row.children.next
    while cell:
        if 'text' not in cell.name:
            result.append({
                'properties': parseProperties(cell),
                'cell': cell.getContent()
            })
        cell = cell.next
    return result


def parseTable(table):
    result = list()
    row = table.children.next
    while row:
        if 'text' not in row.name:
            result.append({
                'properties': parseProperties(row),
                'row': parseRow(row)
            })
        row = row.next
   	return result


def parseDeclarationData(xmlfile):
    result = dict()
    # Parse Personal Data
    personalData = dict()
    personal = scrap.parsePath('//Personal', xmlfile)
    child = personal[0].children.next

    while child:
        if 'text' not in child.name:
            personalData[child.name.strip()] = child.getContent().strip()

        child = child.next

    
    # Parse Declaration Data
    declarationData = dict()
    data = scrap.parsePath('//DeclarationData', xmlfile)
    child = data[0].children.next

    while child:
        if 'text' not in child.name:
            declarationData[child.name.strip()] = child.getContent().strip()

        child = child.next

    tablesData = list()
    tables = scrap.parsePath('//Tables', xmlfile)
    childTable = tables[0].children.next
    while childTable:
        if 'text' not in childTable.name:
            tablesData.append({
            	'properties': parseProperties(childTable),
            	'content': parseTable(childTable)
            	})
        childTable = childTable.next


    result['PersonalData'] = personalData
    result['DeclarationData'] = declarationData
    result['tables'] = tablesData

    return result


# Print all Declaration
dictionary = scrap.getDict()
jsons = list()
for item in dictionary.items():
    xmlfile = scrap.getContent(schema + item[1])
    r = parseDeclarationData(xmlfile)
    jsons.append(r)
    break

print json.dumps(jsons, ensure_ascii=False).encode('utf8')
    
