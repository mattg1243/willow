# General
import random
from decimal import Decimal
from pprint import pprint
from datetime import datetime

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
from borb.pdf.canvas.layout.image.image import Image
from borb.pdf.canvas.color.color import HexColor, X11Color
from borb.pdf.canvas.layout.table.table import TableCell


# Converts to Decimal from Decimal128
def convert_from_d28(amounts, length_amounts):
    x = 0
    while x < length_amounts:
        amounts[x] = amounts[x].to_decimal()
        x += 1
    return amounts


# Sums all Decimal Objects
def calc_amounts(amounts, length_amounts):
    total = Decimal()
    x = 0

    while x < length_amounts:
        total += amounts[x]
        x += 1
    return total

# Debug
def debug_print(IDs, DATES, TYPES, RATES, AMOUNTS, DURATIONS):
    print("\n")
    print(IDs)
    print("\n")
    print("Dates:\n")
    pprint(DATES)
    print("\n")
    print("Types:\n")
    pprint(TYPES)
    print("\n")
    print("Rates:\n")
    pprint(RATES)
    print("\n")
    print("Amounts:\n")
    pprint(AMOUNTS)
    print("\n")
    print("Durations:\n")
    pprint(DURATIONS)
    print("\n")


# STATEMENT GENERATION
def skele():
    pdf = Document()
    page = Page()
    pdf.append_page(page)
    page_layout = SingleColumnLayout
    page_layout.vertical_margin = page.get_page_info().get_height() * Decimal(0.02)
    return pdf


# Builds Statement Header
def _build_statment_header():
    header = Table(number_of_rows=5, number_of_columns=3)

    # Address1
    header.add(Paragraph("1600 Waverly Road"))
    # Date Issued
    header.add(
        Paragraph(
            "Date Issued:", font="Helvetica-Bold", horizontal_alignment=Alignment.RIGHT
        )
    )
    now = datetime.now()
    header.add(Paragraph("%d/%d/%d" % (now.month, now.day, now.year)))
    # City
    header.add(Paragraph("San Francisco, Ca"))
    # Invoice ID ---- Serves no purpose for now
    header.add(
        Paragraph(
            "Invoice #", font="Helvetica-Bold", horizontal_alignment=Alignment.RIGHT
        )
    )
    header.add(Paragraph("%d" % random.randint(1000, 10000)))
    # Due Date
    header.add(Paragraph(" "))
    header.add(
        Paragraph(
            "Due Date", font="Helvetica-Bold", horizontal_alignment=Alignment.RIGHT
        )
    )
    header.add(Paragraph("%d/%d/%d" % (now.month + 1, now.day, now.year)))
    # Spacing
    header.add(Paragraph(" "))
    header.add(Paragraph(" "))
    header.add(Paragraph(" "))
    header.add(Paragraph(" "))
    header.add(Paragraph(" "))
    header.add(Paragraph(" "))

    # Padding
    header.set_padding_on_all_cells(Decimal(2), Decimal(2), Decimal(2), Decimal(2))
    header.no_borders()

    return header


def _build_billing_table(name):
    # Client's name
    NAME = name

    # Build Billing Table
    b_table = Table(number_of_rows=3, number_of_columns=2)
    b_table.add(
        Paragraph(
            "BILL TO",
            background_color=HexColor("FFFFFF"),
            font_color=X11Color("Black"),
        )
    )
    b_table.add(
        Paragraph(
            " ",
            background_color=HexColor("263238"),
            font_color=X11Color("White"),
        )
    )
    b_table.add(Paragraph(NAME))
    b_table.add(Paragraph(" "))
    b_table.add(Paragraph(" "))
    b_table.add(Paragraph(" "))

    b_table.set_padding_on_all_cells(Decimal(2), Decimal(2), Decimal(2), Decimal(2))
    b_table.no_borders()
    return b_table


def _description_table(session, dates, durations, hourly, amounts, new_balance):

    length_of_events = len(hourly)
    descrip_table = Table(number_of_rows=18, number_of_columns=6)
    for h in ["DATE", "TYPE", "DURATION", "RATE", "AMOUNT", "BALANCE"]:
        descrip_table.add(
            TableCell(
                Paragraph(
                    h,
                    horizontal_alignment=Alignment.LEFT,
                    font_color=X11Color("White"),
                    font_size=10,
                    font="Helvetica",
                ),
                background_color=HexColor("000000"),
            )
        )

    # white
    even_color = HexColor("FFFFFF")

    # This loop can be improved
    count = 0

    while count < length_of_events:
        hourly_rate = str(hourly[count])
        amount = str(amounts[count])
        balance = str(new_balance[count])
        date = datetime.strftime(dates[count], "%m-%d-%y")
        descrip_table.add(TableCell(Paragraph(date), background_color=even_color))
        descrip_table.add(
            TableCell(Paragraph(str(session[count])), background_color=even_color)
        )
        descrip_table.add(
            TableCell(Paragraph(str(durations[count])), background_color=even_color)
        )
        descrip_table.add(
            TableCell(Paragraph("$ " + hourly_rate), background_color=even_color)
        )
        descrip_table.add(
            TableCell(Paragraph("$ " + amount), background_color=even_color)
        )
        descrip_table.add(
            TableCell(Paragraph("$ " + balance), background_color=even_color)
        )
        count += 1

    # print(count)
    # If alloted lines is less than the max space
    # Available, fill remaining space with empty rows
    if count < 18:
        for row_number in range(count + 1, 18):
            col_count = 0
            while col_count < 6:
                descrip_table.add(
                    TableCell(Paragraph(" "), background_color=even_color)
                )
                col_count += 1
                if col_count == 5 and row_number == 18:
                    descrip_table.add(Paragraph("Running Balance: %s" % balance))
                    break

    descrip_table.set_padding_on_all_cells(
        Decimal(6), Decimal(6), Decimal(6), Decimal(6)
    )
    descrip_table.no_borders()
    return descrip_table


def generate_statement(NAME, DATES, TYPES, DURATIONS, RATES, AMOUNTS, BALANCE, MULTIPAGE):
    cli = NAME

    pdf = Document()
    page = Page()
    pdf.append_page(page)
    page_layout = SingleColumnLayout(page)
    page_layout.vertical_margin = page.get_page_info().get_height() * Decimal(0.02)

    # Add image
    # TODO: Implement different Image method:
    #     // Not From Web, but from backend ideally. Zeros risk of erroring if
    #     this url changes or stops operating
    page_layout.add(
        Image(
            "https://miro.medium.com/max/1400/1*6HdI84r__tiI65f2vhZN1g.png",
            width=Decimal(108),
            height=Decimal(64),
        ),
    )

    # Appends
    page_layout.add(_build_statment_header())
    page_layout.add(_build_billing_table(cli))
    if(not MULTIPAGE):
        page_layout.add(
            _description_table(TYPES, DATES, DURATIONS, RATES, AMOUNTS, BALANCE)
        )
    else:
        # Add 17 events to page 1
        page_layout.add(
            _description_table(TYPES[0:16], DATES[0:16], DURATIONS[0:16], RATES[0:16], AMOUNTS[0:16], BALANCE[0:16])
        )
        # Create a second page
        page2 = Page()
        pdf.append_page(page2)
        page2_layout = SingleColumnLayout(page2)
        page2_layout.vertical_margin = page2.get_page_info().get_height() * Decimal(0.02)
        # Add the rest of the events
        page2_layout.add(
            _description_table(TYPES[16:], DATES[16:], DURATIONS[16:], RATES[16:], AMOUNTS[16:], BALANCE[16:])
        )
        
        
    # Local path
    with open(f'public/invoices/{cli}.pdf', 'wb') as pdf_file:
        PDF.dumps(pdf_file, pdf)
   
   
    """# Heroku path
    with open(f"/app/public/invoices/{cli}.pdf", "wb") as pdf_file:
        PDF.dumps(pdf_file, pdf) """
        
    