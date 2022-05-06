from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal

from borb.pdf.canvas.layout.table.fixed_column_width_table import (
    FixedColumnWidthTable as Table,
)
from borb.pdf.canvas.layout.text.paragraph import Paragraph
from borb.pdf.canvas.layout.layout_element import Alignment

from util import table_space, ensure_payment_info, phone_formatter

# Statement Header
@dataclass
class Header:
    provider: dict[str, str]
    client: dict[str, str]
    running: int
    table: Table

    def __init__(self, provider, client, running, table):
        self.provider = provider
        self.client = client
        self.running = running
        self.table = table

    # Centered provider name
    def prov_name(self):
        table_space(self.table)
        self.table.add(
            Paragraph(
                self.provider["name"],
                font="Helvetica-Bold",
                horizontal_alignment=Alignment.CENTERED,
            )
        )
        table_space(self.table)

    # Centered provider street address
    def prov_addr(self):
        table_space(self.table)
        self.table.add(
            Paragraph(
                self.provider["address"]["street"],
                horizontal_alignment=Alignment.CENTERED,
            )
        )
        table_space(self.table)

        table_space(self.table)
        self.table.add(
            Paragraph(
                self.provider["address"]["cityState"],
                horizontal_alignment=Alignment.CENTERED,
            )
        )
        table_space(self.table)
        table_space(self.table)

    def prov_contact(self, phone):
        self.table.add(Paragraph(phone, horizontal_alignment=Alignment.CENTERED))
        table_space(self.table)

        # Centered provider email address
        table_space(self.table)
        self.table.add(
            Paragraph(
                self.provider["email"],
                horizontal_alignment=Alignment.CENTERED,
            )
        )
        table_space(self.table)

    def client_name(self):
        name = self.client["clientname"]
        table_space(self.table)
        self.table.add(
            Paragraph(f"Client Name: {name}", horizontal_alignment=Alignment.LEFT)
        )
        table_space(self.table)
        table_space(self.table)

    def statement_date(self):
        now = datetime.now()
        fmt_now = "%d/%d/%d" % (now.month, now.day, now.year)

        self.table.add(
            Paragraph(f"Statement Date: {fmt_now}", horizontal_alignment=Alignment.LEFT)
        )
        table_space(self.table)
        table_space(self.table)

    def running_balance(self):
        running = f"%s{self.running}" % ("$")
        self.table.add(
            Paragraph(f"Balance: {running}", horizontal_alignment=Alignment.LEFT)
        )
        table_space(self.table)
        table_space(self.table)

    def pad(self):
        self.table.set_padding_on_all_cells(
            Decimal(2), Decimal(2), Decimal(2), Decimal(2)
        )
        self.table.no_borders()


# Builds and Returns a Statement Header
def build_statement_header(provider, client, running) -> Table:
    # Initialize
    header_table = Table(number_of_rows=11, number_of_columns=3)
    header = Header(provider, client, running, header_table)

    # Centered provider name
    header.prov_name()

    # Centered provider street address, city, state, zip code
    header.prov_addr()

    # Format Provider Phone Number
    phone = phone_formatter(provider["phone"])

    # Centered provider contact info
    header.prov_contact(phone)

    # Empty Lines break
    for _ in range(1, 6):
        table_space(header.table)

    # Left Aligned Client Name
    header.client_name()

    # Left Aligned Statement Date
    header.statement_date()

    # Left Aligned Running Balance
    header.running_balance()

    # Line Breaks to Finish Header
    for _ in range(0, 3):
        table_space(header.table)

    # Padding
    header.pad()

    return header_table


def build_payments_header(provider) -> Table:
    # Init Payment info table
    payments = Table(number_of_rows=2, number_of_columns=1)

    if ensure_payment_info(provider):
        payments.add(Paragraph(provider["paymentInfo"]))
    else:
        payments.add(Paragraph(" "))

    # Empty Line break
    table_space(payments)

    return payments.no_borders()
