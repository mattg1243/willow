import json
import sys
from dataclasses import dataclass
from datetime import datetime as dt


def is_two_paged(l: list[str]) -> bool:
    if len(l) <= 64:
        return True
    else:
        return False


@dataclass
class Digester:
    def __init__(self):
        self.payload = json.loads(sys.argv[3])

    @classmethod
    def get_and_set_payload(self):
        self.payload = json.loads(sys.argv[3])
        return self.payload

    @staticmethod
    def get_provider_info():
        return json.loads(sys.argv[1])

    @staticmethod
    def get_client_info():
        return json.loads(sys.argv[2])

    def determine_running_balance(self):
        return self.REFLECTED[len(self.REFLECTED) - 1]

    def is_multipage_statement(self):
        if len(self.DATES) > 27:
            self.MULTI = True
            return True
        else:
            self.MULTI = False
            return False

    def push_and_pull_dates(self):
        dates = []

        for i in range(0, len(self.payload)):
            dates.append(dt.strptime(self.payload[i]["date"], "%Y-%m-%dT%H:%M:%S.%fZ"))
        self.DATES = dates
        return dates

    def push_and_pull_types(self):
        types = []
        for i in range(0, len(self.payload)):
            types.append(self.payload[i]["type"])
        self.TYPES = types
        return types

    def push_and_pull_durations(self):
        durations = []
        for i in range(0, len(self.payload)):
            durations.append(self.payload[i]["duration"])
        self.DURATIONS = durations
        return durations

    def push_and_pull_rates(self):
        rates = []
        for i in range(0, len(self.payload)):
            rates.append(self.payload[i]["rate"])
        self.RATES = rates
        return rates

    def push_and_pull_amounts(self):
        amounts = []
        for i in range(0, len(self.payload)):
            amounts.append(self.payload[i]["amount"]["$numberDecimal"])
        self.AMOUNTS = amounts
        return amounts

    def push_and_pull_reflected_balances(self):
        reflected_balances = []
        for i in range(0, len(self.payload)):
            reflected_balances.append(self.payload[i]["newBalance"]["$numberDecimal"])
        self.REFLECTED = reflected_balances
        return reflected_balances


@dataclass
class Payload:
    digester: Digester

    def __init__(self, digester: Digester):
        self.digester = digester

    def deconstruct(self):
        self.digester.push_and_pull_dates()
        self.digester.push_and_pull_types()
        self.digester.push_and_pull_durations()
        self.digester.push_and_pull_rates()
        self.digester.push_and_pull_amounts()
        self.digester.push_and_pull_reflected_balances()

        return (
            self.digester.DATES,
            self.digester.TYPES,
            self.digester.DURATIONS,
            self.digester.RATES,
            self.digester.AMOUNTS,
            self.digester.REFLECTED,
        )
