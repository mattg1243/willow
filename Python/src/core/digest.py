import json
import sys
from pprint import pprint
from datetime import datetime as dt

def get_from():
    print(sys.argv[0])
    FROM = dt.strptime(sys.argv[1], "%Y-%m-%d")
    return FROM
def get_to():
    TO = dt.strptime(sys.argv[2], "%Y-%m-%d")
    return TO

def header_grab():
    header = json.loads(sys.argv[3])
    return header

def load():
    data = json.loads(sys.argv[4])
    data = data['events']
    return data

def parse_dates(data):
    dates = []
    for i in range(0, len(data)):
        dates.append(dt.strptime(data[i]['date'], '%Y-%m-%dT%H:%M:%S.%fZ'))
    return dates

def parse_types(data):
    types = []
    for i in range(0, len(data)):
        types.append(data[i]['type'])
    return types

def parse_durations(data):
    durations = []
    for i in range(0, len(data)):
        durations.append(data[i]['duration'])
    return durations

def parse_rates(data):
    rates = []
    for i in range(0, len(data)):
        rates.append(data[i]['rate'])
    return rates

def parse_amounts(data):
    amounts = []
    for i in range(0, len(data)):
        amounts.append(data[i]['amount']['$numberDecimal'])
    return amounts

def parse_balances(data):
    newBalances = []
    for i in range(0, len(data)):
        newBalances.append(data[i]['newBalance']['$numberDecimal'])
    return newBalances

def find_running_balance(balances):
    running_balance = balances[len(balances)-1]
    return running_balance

def check_multipage(dates):
    if(len(dates) > 17):
        return True
    else:
        return False