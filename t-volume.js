// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
let api = await getTvolume()
// console.log(api)
let widget = await createWidget(api)
if (config.runsInWidget) {
  // The script runs inside a widget, so we pass our instance of ListWidget to be shown inside the widget on the Home Screen.
  Script.setWidget(widget)
} else {
  // The script runs inside the app, so we preview the widget.
  widget.presentMedium()
}
Script.complete()

async function createWidget(api) {
  let widget = new ListWidget()

  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("666666"),
    new Color("13233F")
  ]
  widget.backgroundGradient = gradient

  if (api.error == 0) {
  let titleElement = widget.addText("Datenvolumen")
  titleElement.textColor = Color.white()
  titleElement.textOpacity = 0.7
  titleElement.font = Font.mediumSystemFont(13)
  titleElement.centerAlignText()

  let rest = widget.addText(api.remainingTimeStr)
  rest.font = Font.systemFont(10)
  rest.centerAlignText()
  rest.textColor = Color.white()

  widget.addSpacer(12)

  let head1 = widget.addText("Gesamt")
  head1.textColor = Color.white()
  head1.font = Font.boldSystemFont(18)
  head1.centerAlignText()

  let vo = widget.addText(api.initialVolumeStr)
  vo.textColor = Color.white()
  vo.font = Font.systemFont(14)
  vo.centerAlignText()

  widget.addSpacer(2)

  let head2 = widget.addText("Verbraucht")
  head2.textColor = Color.white()
  head2.font = Font.boldSystemFont(18)
  head2.centerAlignText()

  let vd = widget.addText(api.usedVolumeStr+" ("+api.usedPercentage+"%)")
  vd.textColor = Color.white()
  vd.font = Font.systemFont(14)
  vd.centerAlignText()
} else {
  let head1 = widget.addText("Bitte WLAN aus")
  head1.textColor = Color.white()
  head1.font = Font.boldSystemFont(25)
  head1.centerAlignText()
}
  return widget
}

async function getTvolume() {
  let url = "https://pass.telekom.de/api/service/generic/v1/status"
  let r = new Request(url)
      // API only answers for mobile Safari
  r.headers = { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1" }
  let payload = {}
  try {
  	payload=await r.loadJSON()
	payload.error=0
  } catch {
	payload.error=1
  	payload.remainingTimeStr="Please reload MoFu"
  	payload.initialVolumeStr="reload MoFu"
  	payload.usedVolumeStr="reload MoFu"
  	payload.usedPercentage="reload MoFu"
  }
  return await payload
}
