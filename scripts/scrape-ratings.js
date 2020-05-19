const fs = require("fs")
const { promisify } = require("util")
const fetch = require("node-fetch")
const { csvFormat } = require("d3-dsv")
const cheerio = require("cheerio")
const range = require("lodash/range")
const pick = require("lodash/fp/pick")

const writeFile = promisify(fs.writeFile)

const HOME_ADV_PATTERN = /HOME ADVANTAGE=\[?\s+(\d{1,2}\.\d{1,2})/
const TEAM_RATING_PATTERN = /\d{1,2} +([A-Za-z49\. ]+) +=\s+(\d{1,2}\.\d{2})/g

const TEAM_PATTERNS = new Map([
  [/\bPatriots\b/, "nwe"],
  [/\bBills\b/, "buf"],
  [/\bJets\b/, "nyj"],
  [/\bDolphins\b/, "mia"],
  [/\bRavens\b/, "rav"],
  [/\bSteelers\b/, "pit"],
  [/\bBrowns\b/, "cle"],
  [/\bBengals\b/, "cin"],
  [/\bTexans\b/, "htx"],
  [/\bTitans\b/, "oti"],
  [/\bColts\b/, "clt"],
  [/\bJaguars\b/, "jax"],
  [/\bChiefs\b/, "kan"],
  [/\bRaiders\b/, "rai"],
  [/\bBroncos\b/, "den"],
  [/\bChargers\b/, "sdg"],
  [/\bEagles\b/, "phi"],
  [/\bCowboys\b/, "dal"],
  [/\bGiants\b/, "nyg"],
  [/\bRedskins\b/, "was"],
  [/\bPackers\b/, "gnb"],
  [/\bVikings\b/, "min"],
  [/\bBears\b/, "chi"],
  [/\bLions\b/, "det"],
  [/\bSaints\b/, "nor"],
  [/\bBuccaneers\b/, "tam"],
  [/\bFalcons\b/, "atl"],
  [/\bPanthers\b/, "car"],
  [/\b49ers\b/, "sfo"],
  [/\bSeahawks\b/, "sea"],
  [/\bRams\b/, "ram"],
  [/\bCardinals\b/, "crd"],
])

scrape()

async function scrape() {
  let pages = await Promise.all(range(2002, 2020).map(scrapePage))

  let homeAdvData = pages.map(pick(["year", "homeAdv"]))
  writeFile(
    "static/data/ratings/home-adv.csv",
    csvFormat(homeAdvData, ["year", "homeAdv"])
  )

  for (const page of pages) {
    writeFile(
      `static/data/ratings/${page.year}.csv`,
      csvFormat(page.ratings, ["id", "rating"])
    )
  }
}

async function scrapePage(year) {
  let url = `https://www.usatoday.com/sports/nfl/sagarin/${year}/rating/`
  let response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Response not OK (${response.status}):`, url)
  }

  let html = await response.text()
  let $ = cheerio.load(html)

  let rawRatingsText = $(determineSelector(year)).eq(0).text()

  let [, homeAdv] = rawRatingsText.match(HOME_ADV_PATTERN)

  let ratings = []
  while (true) {
    let match = TEAM_RATING_PATTERN.exec(rawRatingsText)

    if (match === null) {
      break
    }

    let [, team, rating] = match
    ratings.push({ id: determineId(team), rating })
  }

  console.log(year + ":", "Home Advantage -", parseFloat(homeAdv))
  console.table(ratings)
  return {
    year,
    homeAdv,
    ratings,
  }
}

function determineSelector(year) {
  switch (year) {
    case 2003:
    case 2013:
      return "#sagarin pre:nth-of-type(3)"
    default:
      return "#sagarin pre:nth-of-type(2)"
  }
}

function determineId(team) {
  for (const [pattern, id] of TEAM_PATTERNS) {
    if (pattern.test(team)) return id
  }

  throw new Error("No ID match found for " + team)
}
