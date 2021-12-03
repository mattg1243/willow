from util import generate
from logger import _set_log_params
from digest import get_from, get_to, load, header_grab, parse_dates, parse_types, parse_durations
from digest import parse_rates, parse_amounts, parse_balances

# Defines logging params
logger = _set_log_params()

# Main Script
if __name__ == "__main__":
    try:
        # Statement start date
        FROM = get_from()
        # Statement end date
        TO = get_to()
        # User info
        header = header_grab()
        # Event log
        data = load()
        # Parse dates
        dates = parse_dates(data)
        # Parse types
        types = parse_types(data)
        # Parse durations
        durations = parse_durations(data)
        # Parse rates
        rates = parse_rates(data)
        # Parse amounts
        amounts = parse_amounts(data)
        # Parse new balances
        newBalances = parse_balances(data)
        
        print('DATES -> ', dates)
        print('TYPES -> ', types)
        print('DURATIONS -> ', durations)
        print('RATES -> ', rates)
        print('AMOUNTS -> ', amounts)
        print('NEWBALANCES -> ', newBalances)
        print('START -> ', FROM, 'END -> ', TO)
        print('USER INFO -> ', header)
        
    except Exception as e:
        print("Error parsing arguments: %s", e)
        
    try:
        generate(header['clientname'], dates, types, durations, rates, amounts, newBalances)
    
    except Exception as e:
        print('Error generating statement: %s', e)
        