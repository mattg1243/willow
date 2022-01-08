from util import generate_statement
from logger import _set_log_params
from digest import get_provider_info, load, get_client_info, parse_dates, parse_types, parse_durations
from digest import parse_rates, parse_amounts, parse_balances, check_multipage, find_running_balance

logger = _set_log_params()

# Main Script
if __name__ == "__main__":
    
    # Parse Arguments
    try:
        # Provider info
        prov = get_provider_info()
        print(f'PROVIDER -> {prov}\n')
        # User info
        header = get_client_info()
        print('USER INFO -> ', header)
        # Event log
        data = load()
        # Parse dates
        dates = parse_dates(data)
        print(len(dates))
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
        # Find running balance
        running_balance = find_running_balance(newBalances)
        print('RUNNING BALANCE -> ', running_balance)
    
    # If Argument Parsing Failed - Log & Terminate     
    except Exception as ArgParseError:
        logger.critical("Failed Parsing Arguments!: %s" % ArgParseError)
        exit(0)
    
    # Check if statment is single paged or multipaged
    multipage = check_multipage(dates)
    
    # Generate the statement
    try:
        generate_statement(header, prov, dates, types, durations, rates, amounts, newBalances, multipage)
   
    # Log Error & Terminate
    except Exception as StatementError:
        print(StatementError)
        logger.critical("Failed to Generate Statement!: %s" % StatementError)
        exit(0)