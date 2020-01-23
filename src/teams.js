import { identity } from "lodash"

/** @enum {string} */
export const Conference = {
  AFC: "AFC",
  NFC: "NFC"
}

/** @enum {string} */
export const Division = {
  EAST: "East",
  NORTH: "North",
  SOUTH: "South",
  WEST: "West"
}

/**
 * @param {Team} team
 * @returns {Team}
 */
export const Team = team => identity(team)

/**
 * @typedef {object} Team
 * @prop {string} id A unique ID for the team
 * @prop {string} location
 * @prop {string} name
 * @prop {string} abbreviation The team's official abbreviation
 * @prop {Conference} conference The team's NFL conference
 * @prop {Division} division The team's division within its conference
 */
