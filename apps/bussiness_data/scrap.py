import requests
import libxml2

XML_URL = 'http://register.bulnao.government.bg/2013/list.xml'


def getContent(xml_url):
    content = requests.get(xml_url).content
    return content


def parsePath(xpath, content):
    doc = libxml2.parseDoc(content)
    ctxt = doc.xpathNewContext()
    res = ctxt.xpathEval(xpath)
    return res


def parseContent(xpath, content):
    doc = libxml2.parseDoc(content)
    ctxt = doc.xpathNewContext()
    res = ctxt.xpathEval(xpath)

    parsedContent = [x.getContent() for x in res]

    doc.freeDoc()
    ctxt.xpathFreeContext()
    return parsedContent


def getDict():
    content = getContent(XML_URL)
    names = parseContent('//Person/Name', content)
    xml_urls = parseContent('//Declaration/xmlFile', content)
    dictionary = dict(zip(names,xml_urls))
    return dictionary


def main():
    dictionary = getDict()
    for item in dictionary.items():
        print item[0], item[1]
    print len(dictionary.items())

if __name__ == '__main__':
    main()
