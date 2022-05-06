from pprint import pprint
from logger import set_log_params
from digest import Digester, Payload
from core import build_transposed_statement

import sys

logger = set_log_params()

# Main Script
if __name__ == "__main__":

    # Parse Arguments
    try:
        # Digest payload
        digester = Digester()
        payload: Payload = Payload(digester)
        (DATES, TYPES, DURATIONS, RATES, AMOUNTS, REFLECTED) = payload.deconstruct()

    # If Argument Parsing Failed - Log & Terminate
    except Exception as ArgParseError:
        logger.critical("Failed Parsing Arguments!: %s" % ArgParseError)
        exit(0)

    if len(DATES) > 101:
        sys.exit(0)

    # Check if statment is single paged or multipaged
    is_multi = digester.is_multipage_statement()

    # Determine Running Balance
    running_b = digester.determine_running_balance()

    # Console log params
    print("DATES ->", DATES)
    print("DURATIONS ->", DURATIONS)
    print("RATES ->", RATES)
    print("AMOUNTS ->", AMOUNTS)
    print("REFLECTED ->", REFLECTED)
    print()
    print("IS_MULTI ->", is_multi)
    print("RUNNING_BALANCE ->", running_b)
    print("ROWS -> ", len(DATES))

    try:
        provider = digester.get_provider_info()
        client = digester.get_client_info()
        print(provider, client)

        build_transposed_statement(
            client,
            provider,
            payload,
            running_b,
            is_multi,
        )

    except Exception as StatementError:
        pprint(StatementError)
        logger.critical("Failed to generate statement!: %s" % StatementError)
        exit(0)
