import sys
import datetime
from util import _set_crit, _mongo_cluster, _mongo_client, _record_handling
from bson import ObjectId

# Main Script
if __name__ == '__main__':
    # Target Client
    try:
        CLIENT_ID = ObjectId(sys.argv[1])
    except Exception as CLIENT_ID_error:
        print('Invalid client ID syntax: %s' % CLIENT_ID_error)
    # Passed Date Range to query Mongo
    try:
        FROM = datetime.datetime.strptime(sys.argv[2], '%Y-%m-%d')
        TO = datetime.datetime.strptime(sys.argv[3], '%Y-%m-%d')
    except Exception as date_error_handle:
        print('Error parsing date range: %s' % date_error_handle)
    # Target Critical
    critical = _set_crit(CLIENT_ID, FROM, TO)  
    # Make Mongo Connection
    try:
        cluster = _mongo_cluster()
        client = _mongo_client(cluster)
        # Access data
        db = client.maindb
        events_col = db.events
        # Access collections and pull all data that matches criteria
        data_fetched = events_col.find(critical)
    except Exception as _mongo_error_handler:
        print('Error connecting to MongoDB: %s' % _mongo_error_handler)
    

    # Handles Records Obtained
    try:
        _record_handling(data_fetched, CLIENT_ID)
    except Exception as _generator_error_handler:
        print('Error generating statements: %s' % _generator_error_handler)
