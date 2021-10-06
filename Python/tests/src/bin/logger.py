import logging

def _set_log_params():
    # Create logger with script name
    logger = logging.getLogger(__name__)
    # Set log level to debug
    logger.setLevel(logging.DEBUG)
    # Create file handle for writing to
    file_handle = logging.FileHandler('Python/tests/logs/statements.log')
    file_handle.setLevel(logging.DEBUG)
    # Create console handle
    console_handle = logging.StreamHandler()
    console_handle.setLevel(logging.INFO)
    # Create the formatter
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    console_handle.setFormatter(formatter)
    file_handle.setFormatter(formatter)

    logger.addHandler(file_handle)
    logger.addHandler(console_handle)
    

    return logger
