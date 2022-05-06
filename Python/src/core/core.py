# General
from decimal import Decimal
import json
import sys
from datetime import datetime as dt
from dataclasses import dataclass

# For PDF Handling
from borb.pdf.pdf import PDF
from borb.pdf.page.page import Page
from borb.pdf.document import Document
from borb.pdf.canvas.layout.page_layout.multi_column_layout import SingleColumnLayout

from Header import build_statement_header, build_payments_header
from DescriptionTable import build_descrip_table


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


def is_two_paged(l: list[str]) -> bool:
    if len(l) <= 64:
        return True
    else:
        return False


def StatementInit() -> tuple[Document, SingleColumnLayout]:
    pdf = Document()
    page = Page()
    pdf.append_page(page)
    page_layout = SingleColumnLayout(
        page, vertical_margin=page.get_page_info().get_height() * Decimal(0.02)
    )
    return (pdf, page_layout)


def SkeleAppend(pdf: Document) -> Page:
    page_next = Page()
    pdf.append_page(page_next)
    return page_next


def SkeleLayout(page: Page) -> SingleColumnLayout:
    return SingleColumnLayout(
        page, vertical_margin=page.get_page_info().get_height() * Decimal(0.04)
    )


def DescribeSingle(
    page_layout: SingleColumnLayout, TYPES, DATES, DURATIONS, RATES, AMOUNTS, BALANCES
) -> SingleColumnLayout:
    page_layout.add(
        build_descrip_table(
            28,
            TYPES[0:27],
            DATES[0:27],
            DURATIONS[0:27],
            RATES[0:27],
            AMOUNTS[0:27],
            BALANCES[0:27],
        )
    )
    return page_layout


def DescribeDouble(
    page_layout: SingleColumnLayout,
    pdf: Document,
    TYPES,
    DATES,
    DURATIONS,
    RATES,
    AMOUNTS,
    BALANCES,
) -> Document:
    page_layout.add(
        build_descrip_table(
            28,
            TYPES[0:27],
            DATES[0:27],
            DURATIONS[0:27],
            RATES[0:27],
            AMOUNTS[0:27],
            BALANCES[0:27],
        )
    )

    page2 = SkeleAppend(pdf)
    page2_layout = SkeleLayout(page2)
    page2_layout.add(
        build_descrip_table(
            38,
            TYPES[27:],
            DATES[27:],
            DURATIONS[27:],
            RATES[27:],
            AMOUNTS[27:],
            BALANCES[27:],
        )
    )
    return pdf


def DescribeTriple(
    page_layout: SingleColumnLayout,
    pdf: Document,
    TYPES,
    DATES,
    DURATIONS,
    RATES,
    AMOUNTS,
    BALANCES,
) -> Document:
    page_layout.add(
        build_descrip_table(
            28,
            TYPES[0:27],
            DATES[0:27],
            DURATIONS[0:27],
            RATES[0:27],
            AMOUNTS[0:27],
            BALANCES[0:27],
        )
    )

    page2 = SkeleAppend(pdf)
    page2_layout = SkeleLayout(page2)
    page2_layout.add(
        build_descrip_table(
            38,
            TYPES[27:64],
            DATES[27:64],
            DURATIONS[27:64],
            RATES[27:64],
            AMOUNTS[27:64],
            BALANCES[27:64],
        )
    )

    page3 = SkeleAppend(pdf)
    page3_layout = SkeleLayout(page3)
    page3_layout.add(
        build_descrip_table(
            38,
            TYPES[64:],
            DATES[64:],
            DURATIONS[64:],
            RATES[64:],
            AMOUNTS[64:],
            BALANCES[64:],
        )
    )

    return pdf


def build_transposed_statement(
    CLIENT: dict[str, str],
    PROV: dict[str, str],
    PAYLOAD: Payload,
    RUNNING: int,
    MULTIPAGE: bool,
):
    (DATES, TYPES, DURATIONS, RATES, AMOUNTS, BALANCES) = PAYLOAD.deconstruct()

    name = CLIENT["clientname"]
    print(name)

    # Initializing Statement..
    (pdf, page_layout) = StatementInit()

    # Append Statement Header
    page_layout.add(build_statement_header(PROV, CLIENT, RUNNING))

    # Will Leave an Empty Row if No Payment Info Provided
    page_layout.add(build_payments_header(PROV))

    # If single paged - build single description table
    if not MULTIPAGE:
        page_layout = DescribeSingle(
            page_layout, TYPES, DATES, DURATIONS, RATES, AMOUNTS, BALANCES
        )
    # Two paged
    elif is_two_paged(DATES):
        pdf = DescribeDouble(
            page_layout, pdf, TYPES, DATES, DURATIONS, RATES, AMOUNTS, BALANCES
        )
    else:
        pdf = DescribeTriple(
            page_layout, pdf, TYPES, DATES, DURATIONS, RATES, AMOUNTS, BALANCES
        )

    with open(f"public/invoices/{name}.pdf", "wb") as pdf_file:
        PDF.dumps(pdf_file, pdf)
