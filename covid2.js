// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: user-md;
// Licence: Robert Koch-Institut (RKI), dl-de/by-2-0
const newCasesApiUrl = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=json&where=NeuerFall%20IN(1%2C%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22AnzahlFall%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&resultType=standard&cacheHint=true`;

const incidenceUrl = (location) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,last_update,cases,cases7_per_100k&geometry=${location.longitude.toFixed(3)}%2C${location.latitude.toFixed(3)}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&returnGeometry=false&outSR=4326&f=json`

let widget = await createWidget()
if (!config.runsInWidget) {
 await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
 let data, attr, header, label

   const list = new ListWidget()


 // fetch new cases
 data = await new Request(newCasesApiUrl).loadJSON()

 const summi = data.features[0].attributes.value

 if(!data || !data.features || !data.features.length) {
   const errorList = new ListWidget()
   errorList.addText("Keine Ergebnisse für die Anfrage nach den Neuinfektionen.")
   return errorList
 }

  // fetch new incidents
 let location
 let location2

   var twocord = args.widgetParameter.split("/")
   const fixedCoordinates = twocord[0].split(",").map(parseFloat)
   const fixedCoordinates2 = twocord[1].split(",").map(parseFloat)

   location = {
     latitude: fixedCoordinates[0],
     longitude: fixedCoordinates[1]
   }

   location2 = {
     latitude: fixedCoordinates2[0],
     longitude: fixedCoordinates2[1]
   }


 data = await new Request(incidenceUrl(location)).loadJSON()
 data2 = await new Request(incidenceUrl(location2)).loadJSON()

 if(!data || !data.features || !data.features.length) {
   const errorList = new ListWidget()
   errorList.addText("Keine Ergebnisse für den aktuellen Ort gefunden.")
   return errorList
 }

 attr = data.features[0].attributes
 const incidence = attr.cases7_per_100k.toFixed(1)
 const cityName = attr.GEN
 const cases =attr.cases
 const lastUpdate = attr.last_update

attr2 = data2.features[0].attributes
 const incidence2 = attr2.cases7_per_100k.toFixed(1)
 const cityName2 = attr2.GEN
 const cases2 = attr2.cases
 const lastUpdate2 = attr2.last_update

 // header = list.addText("🦠 Inzidenz".toUpperCase())
 // header.centerAlignText()
 // header.font = Font.mediumSystemFont(9)

 label = list.addText("🦠 "+incidence)
 label.centerAlignText()
 label.font = Font.mediumSystemFont(18)

 label2 = list.addText("("+cases+")")
 label2.centerAlignText()
 label2.font = Font.mediumSystemFont(10)


 if(incidence >= 50) {
   label.textColor = Color.red()
 } else if(incidence >= 25) {
   label.textColor = Color.orange()
 }

 const city = list.addText(cityName)
 city.centerAlignText()
 city.font = Font.mediumSystemFont(10)
 city.textColor = Color.gray()

 list.addSpacer()


 // header = list.addText("🦠 Inzidenz".toUpperCase())
 // header.centerAlignText()
 // header.font = Font.mediumSystemFont(9)

 label = list.addText("🦠 "+incidence2)
 label.centerAlignText()
 label.font = Font.mediumSystemFont(18)

 label2 = list.addText("("+cases2+")")
 label2.centerAlignText()
 label2.font = Font.mediumSystemFont(10)


 if(incidence2 >= 50) {
   label.textColor = Color.red()
 } else if(incidence2 >= 25) {
   label.textColor = Color.orange()
 }

 const city2 = list.addText(cityName2)
 city2.centerAlignText()
 city2.font = Font.mediumSystemFont(10)
 city2.textColor = Color.gray()

   list.addSpacer()

  label3 = list.addText (lastUpdate.substr(0,10)+" (+"+summi+")")
 label3.centerAlignText()
 label3.font = Font.mediumSystemFont(9)


 return list
}
