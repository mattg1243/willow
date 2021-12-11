from util import generate_statement
from logger import _set_log_params
from digest import get_from, get_to, load, header_grab, parse_dates, parse_types, parse_durations
from digest import parse_rates, parse_amounts, parse_balances, check_multipage, find_running_balance

# Defines logging params
#logger = _set_log_params()

# Main Script
if __name__ == "__main__":
    
    # Statement start date
    FROM = get_from()
    # Statement end date
    TO = get_to()
    print('START -> ', FROM, 'END -> ', TO)
    # User info
    header = header_grab()
    print('USER INFO -> ', header)
    # Event log
    data = load()
    # Parse dates
    dates = parse_dates(data)
    print('DATES -> ', dates)
    # Parse types
    types = parse_types(data)
    print('TYPES -> ', types)
    # Parse durations
    durations = parse_durations(data)
    print('DURATIONS -> ', durations)
    # Parse rates
    rates = parse_rates(data)
    print('RATES -> ', rates)
    # Parse amounts
    amounts = parse_amounts(data)
    print('AMOUNTS -> ', amounts)
    # Parse new balances
    newBalances = parse_balances(data)
    print('NEWBALANCES -> ', newBalances)
    # Find running balance
    running_balance = find_running_balance(newBalances)
    print('RUNNING BALANCE -> ', running_balance)
    
    # Check if statment is single paged or multipaged
    multipage = check_multipage(dates)
    # Generat the statement
    generate_statement(header['clientname'], dates, types, durations, rates, amounts, newBalances, multipage)
  