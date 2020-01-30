import { loadDataset } from "../testHelpers"
import { ScheduleFilters } from "./schedules"

const [TEAMS, SCHEDULE] = loadDataset(2002)

describe("ScheduleFilters", () => {
  it("finds the head-to-head games between two or more teams", () => {
    const { headToHeadGames } = ScheduleFilters(SCHEDULE)

    expect(headToHeadGames(TEAMS.atl, TEAMS.car)).toMatchSnapshot()
    expect(headToHeadGames(TEAMS.atl, TEAMS.car, TEAMS.pit)).toMatchSnapshot()
    expect(headToHeadGames(TEAMS.atl, TEAMS.nwe)).toEqual([])
    expect(headToHeadGames(TEAMS.atl)).toEqual([])
    expect(headToHeadGames()).toEqual([])
  })

  it("finds the common games between two or more teams", () => {
    const { commonGames } = ScheduleFilters(SCHEDULE)

    expect(commonGames(TEAMS.ram, TEAMS.den)).toMatchSnapshot()
    expect(commonGames(TEAMS.ram, TEAMS.den, TEAMS.jax)).toMatchSnapshot()
    expect(commonGames(TEAMS.ram)).toEqual([])
    expect(commonGames()).toEqual([])
  })

  it("finds the division games of one or more teams", () => {
    const { divisionGames } = ScheduleFilters(SCHEDULE)

    expect(divisionGames(TEAMS.nwe)).toMatchSnapshot()
    expect(divisionGames(TEAMS.nwe, TEAMS.sea)).toMatchSnapshot()
    expect(divisionGames()).toEqual([])
  })

  it("finds the conference games of one or more teams", () => {
    const { conferenceGames } = ScheduleFilters(SCHEDULE)

    expect(conferenceGames(TEAMS.cin)).toMatchSnapshot()
    expect(conferenceGames(TEAMS.cin, TEAMS.nor)).toMatchSnapshot()
    expect(conferenceGames()).toEqual([])
  })

  it("finds all games involving one or more teams", () => {
    const { allGames } = ScheduleFilters(SCHEDULE)

    expect(allGames(TEAMS.crd)).toMatchSnapshot()
    expect(allGames(TEAMS.crd, TEAMS.rav)).toMatchSnapshot()
    expect(allGames()).toEqual([])
  })
})
