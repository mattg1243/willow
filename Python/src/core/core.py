# General
from decimal import Decimal
from datetime import datetime
from pickletools import int4, uint1
from digest import Payload, is_two_paged
from dataclasses import dataclass

# For PDF Handling
from borb.pdf.pdf import PDF
from borb.pdf.page.page import Page
from borb.pdf.document import Document
from borb.pdf.canvas.layout.page_layout.multi_column_layout import SingleColumnLayout
from borb.pdf.canvas.layout.table.fixed_column_width_table import (
    FixedColumnWidthTable as Table,
)
from borb.pdf.canvas.layout.text.paragraph import Paragraph
from borb.pdf.canvas.layout.layout_element import Alignment
from borb.pdf.canvas.color.color import HexColor, X11Color
from borb.pdf.canvas.layout.table.table import TableCell

# Util func
def ensure_payment_info(provider: dict[str, str]) -> bool:
    if provider["paymentInfo"] == "":
        return False
    else:
        return True


# Util Func
def phone_formatter(n):
    return format(int(n[:-1]), ",").replace(",", "-") + n[-1]


# Util Func
def table_space(table: Table):
    table.add(Paragraph(" "))


# Util Func
def std_event(event):
    if event == "Retainer" or event == "Refund":
        return False
    else:
        return True


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


# Description Table
@dataclass
class DescripTable:
    rows: int
    types: list[str]
    dates: list[datetime]
    durations: list[int]
    hourly: list[int]
    amounts: list[float]
    reflected_balances: list[float]
    table: Table
    size: int

    def __init__(
        self, rows, types, dates, durations, hourly, amounts, reflected_balances
    ):
        self.rows = rows
        self.types = types
        self.dates = dates
        self.durations = durations
        self.hourly = hourly
        self.amounts = amounts
        self.reflected_balances = reflected_balances
        self.table = Table(number_of_rows=rows, number_of_columns=6)
        self.table.set_borders_on_all_cells(True, True, True, True)
        self.size = len(dates)

    def skele(self):
        for h in ["DATE", "TYPE", "DURATION", "RATE", "AMOUNT", "BALANCE"]:
            self.table.add(
                TableCell(
                    Paragraph(
                        h,
                        horizontal_alignment=Alignment.LEFT,
                        font_color=X11Color("Black"),
                        font_size=10,
                        font="Helvetica-Bold",
                    ),
                    border_top=True,
                    border_bottom=True,
                    border_left=True,
                    border_right=True,
                    border_color=X11Color("Black"),
                )
            )

    def transpose(self, even_color: HexColor, odd_color: HexColor) -> Table:
        for i in range(0, self.size):
            (rate, amount, balance) = (
                self.hourly[i],
                self.amounts[i],
                self.reflected_balances[i],
            )

            # Check if usual event
            standard = std_event(self.types[i])
            # Fmt datetime objects
            date = datetime.strftime(self.dates[i], "%m-%d-%y")

            # Date
            self.table.add(TableCell(Paragraph(date), background_color=even_color))
            # Type
            self.table.add(
                TableCell(Paragraph(self.types[i]), background_color=even_color)
            )
            # Duration
            if not standard:
                self.table.add(TableCell(Paragraph(" "), background_color=even_color))
            else:
                duration = f"{self.durations[i]}"
                self.table.add(
                    TableCell(Paragraph(duration), background_color=even_color)
                )
            # Rate
            if not standard:
                self.table.add(TableCell(Paragraph(" "), background_color=even_color))
            else:
                rate = f"%s{rate}" % ("$")
                self.table.add(TableCell(Paragraph(rate), background_color=even_color))
            # Amount
            amount = f"%s{amount}" % ("$")
            self.table.add(TableCell(Paragraph(amount), background_color=even_color))
            # Reflected Balance
            reflected = f"%s{balance}" % ("$")
            self.table.add(TableCell(Paragraph(balance), background_color=even_color))

        # If alloted lines is less than the max available, fill remaining lines with empty rows
        print(self.size - 1, self.rows)
        if self.size < self.rows:
            for row_number in range(self.size+1, self.rows):
                col_iter = 0
                while col_iter < 6:
                    self.table.add(TableCell(Paragraph(" ")))
                    col_iter += 1
                    if row_number == self.rows:
                        break
        # Set padding on all cells
        self.table.set_padding_on_all_cells(
            Decimal(4), Decimal(4), Decimal(4), Decimal(4)
        )
        self.table.no_borders()
        self.table.even_odd_row_colors(
            even_row_color=even_color, odd_row_color=odd_color
        )

        return self.table


def build_descrip_table(rows, types, dates, durations, hourly, amounts, new_balance):
    description = DescripTable(
        rows, types, dates, durations, hourly, amounts, new_balance
    )

    description.skele()

    # white
    even_color = HexColor("ffffff")
    # grey
    odd_color = HexColor("d3d3d3")

    transposition = description.transpose(even_color, odd_color)

    return transposition


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
            1,
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

    """with open(f"public/invoices/{name}.pdf", "wb") as pdf_file:
        PDF.dumps(pdf_file, pdf)"""

    # local path
    with open(f"public/invoices/{name}.pdf", "wb") as pdf_file:
        PDF.dumps(pdf_file, pdf)
