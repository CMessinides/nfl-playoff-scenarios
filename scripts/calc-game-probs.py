import csv
from scipy.stats import norm

STD_DEV = 13.45


class WinProbCalculator:
    def __init__(self, ratings, home_adv):
        self.ratings = ratings
        self.home_adv = home_adv

    def calc_home_win_prob(self, home_team, away_team):
        line = self.ratings[home_team] + self.home_adv - self.ratings[away_team]
        prob_win_in_regulation = 1 - norm.cdf(0.5, loc=line, scale=STD_DEV)
        prob_regulation_ends_in_tie = norm.cdf(0.5, loc=line, scale=STD_DEV) - norm.cdf(
            -0.5, loc=line, scale=STD_DEV
        )
        return prob_win_in_regulation + 0.5 * prob_regulation_ends_in_tie


home_advantages = {}
with open("static/data/ratings/home-adv.csv", newline="") as home_adv_file:
    home_adv_reader = csv.DictReader(home_adv_file)
    for row in home_adv_reader:
        home_advantages[int(row["year"])] = float(row["homeAdv"])

print(home_advantages)

for year in range(2002, 2020):
    ratings = {}
    with open("static/data/ratings/" + str(year) + ".csv", newline="") as ratingsfile:
        ratingsreader = csv.DictReader(ratingsfile)
        for row in ratingsreader:
            ratings[row["id"]] = float(row["rating"])

    calculator = WinProbCalculator(ratings, home_advantages[year])

    with open(
        "static/data/games/" + str(year) + ".csv", "r", newline=""
    ) as input, open(
        "static/data/games/" + str(year) + "_updated.csv", "w", newline=""
    ) as output:
        game_reader = csv.reader(input)
        game_writer = csv.writer(output)

        for i, row in enumerate(game_reader):
            if i is not 0:
                home, away = row[3:5]
                home_win_prob = calculator.calc_home_win_prob(home, away)
                row.append(home_win_prob)

                print(
                    "{0} (Rtg: {1}) @ {2} (Rtg: {3})".format(
                        away, ratings[away], home, ratings[home]
                    )
                )
                print("Home Adv: {0}".format(home_advantages[year]))
                print("Home Win Prob: {0}".format(home_win_prob))
                print("...")
            else:
                row.append("homeWinProb")

            game_writer.writerow(row)
