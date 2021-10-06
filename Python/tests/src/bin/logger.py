import logging

logger = logging.getLogger(__name__)
# Will only log here, if its called somewhere else, wont log
logging.propogate = False
logging.debug("this is a debug message")
