import sys
import datetime
from util import _set_crit, _mongo_cluster, _mongo_client, _record_handling
from bson import ObjectId

# Main Script
if __name__ == '__main__':
    # Target Client
    CLIENT_NAME = sys.argv[4]

    try:
        CLIENT_ID = ObjectId(sys.argv[1])
    # Target Client Error Handling
    except Exception as CLIENT_ID_error:
        print('Invalid client ID syntax: %s' % CLIENT_ID_error)
    # Passed Date Range to query Mongo
    try:
        FROM = datetime.datetime.strptime(sys.argv[2], '%Y-%m-%d')
        TO = datetime.datetime.strptime(sys.argv[3], '%Y-%m-%d')
    # Date Range Error Handling
    except Exception as date_error_handle:
        print('Error parsing date range: %s' % date_error_handle)
    # Target Critical
    critical = _set_crit(CLIENT_ID, FROM, TO)  
    # Make Mongo Connection
    try:
        # Initialize Cluster
        cluster = _mongo_cluster()
        client = _mongo_client(cluster)
        # Set Instance
        db = client.maindb
        events_col = db.events
        # Access Collection and Pull All Crtical Data
        data_fetched = events_col.find(critical)
    # Mongo Connection Error Handling
    except Exception as _mongo_error_handler:
        print('Error connecting to MongoDB: %s' % _mongo_error_handler)
    

    # Handles Records Obtained
    try:
        _record_handling(data_fetched, CLIENT_ID, CLIENT_NAME)
    # Record Handle Error Handling
    except Exception as _generator_error_handler:
        print('Error generating statements: %s' % _generator_error_handler)
