# General
from decimal import Decimal
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
from borb.pdf.canvas.color.color import HexColor, X11Color
from borb.pdf.canvas.layout.table.table import TableCell


# STATEMENT GENERATION
def skele():
    pdf = Document()
    page = Page()
    pdf.append_page(page)
    page_layout = SingleColumnLayout
    page_layout.vertical_margin = page.get_page_info().get_height() * Decimal(0.02)
    return pdf

# Phone Number Formatter
def phone_formatter(n):
    return format(int(n[:-1]), ",").replace(",", "-") + n[-1]

# Builds Statement Header
def _build_statment_header(provider, client):
    # Initialize
    header = Table(number_of_rows=6, number_of_columns=3)
    
    # Format Provider Phone Number
    phone = phone_formatter(provider["phone"])
    print(phone)
    
    # Provider Name
    header.add(
        Paragraph(
            provider["name"], 
            font="Helvetica-Bold",
            horizontal_alignment=Alignment.LEFT
            
        )
    )
    
    # Client Name
    header.add(
        Paragraph(
            "Client Name: ",
            font="Helvetica-Bold",
            horizontal_alignment=Alignment.RIGHT
        )
    )
    header.add(
        Paragraph(
            client["clientname"]
        )
    )
    
    # Provider Address
    header.add(
        Paragraph(
            provider["address"]["street"],
            horizontal_alignment=Alignment.LEFT
        )
    )

    # Date Issued
    header.add(
        Paragraph(
            "Statement Date:", 
            font="Helvetica-Bold", 
            horizontal_alignment=Alignment.RIGHT
        )
    )
    now = datetime.now()
    header.add(Paragraph("%d/%d/%d" % (now.month, now.day, now.year)))
    
    # Provider City, Zip Code
    header.add(
        Paragraph(provider["address"]["cityState"])
    )
    
    # Spacing
    header.add(Paragraph(" "))
    header.add(Paragraph(" "))
    header.add(Paragraph(" "))
    header.add(Paragraph(" "))
    header.add(Paragraph(" "))
    
    
    # Provider Phone
    header.add(
        Paragraph(
            phone,
            horizontal_alignment=Alignment.LEFT
        )
    )
    
    # Spacing
    header.add(Paragraph(" "))
    header.add(Paragraph(" "))
    
    # Provider Email
    header.add(
        Paragraph(
            provider["email"]
        )
    )
    
    # Spacing
    header.add(Paragraph(" "))
    header.add(Paragraph(" "))

    # Padding
    header.set_padding_on_all_cells(Decimal(2), Decimal(2), Decimal(2), Decimal(2))
    header.no_borders()

    return header


def _build_billing_table():

    # Build Billing Table
    b_table = Table(number_of_rows=3, number_of_columns=2)
    
    # Spacing
    b_table.add(Paragraph(" "))
    b_table.add(Paragraph(" "))
    
    # Activity
    b_table.add(
        Paragraph(
            "Activity:",
            background_color=HexColor("FFFFFF"),
            font="Helvetica-Bold",
            font_color=X11Color("Black"),
        )
    )
    
    # Spacing
    b_table.add(Paragraph(" "))
    b_table.add(Paragraph(" "))
    b_table.add(Paragraph(" "))

    b_table.set_padding_on_all_cells(Decimal(2), Decimal(2), Decimal(2), Decimal(2))
    b_table.no_borders()
    
    return b_table

def std_event(event):
    if(event == 'Retainer' or event == 'Refund'):
        return False
    else:
        return True

def _description_table(rows, session, dates, durations, hourly, amounts, new_balance):
    length_of_events = len(dates)
    descrip_table = Table(number_of_rows=rows, number_of_columns=6)
    descrip_table.set_borders_on_all_cells(True, True, True, True)
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

    # Fill Out Table With Events
    iter = 0
    while iter < length_of_events:          # Number of events to iterate through - 16 max on one page 
        # Convert to Working Strings        # If multipaged - only first 16 will be passed into this function
        hourly_rate = str(hourly[iter])     # Then the fn will be called again with the remaining events to be processed being passed in
        amount = str(amounts[iter])         # The length_of_events variable will always refer to how many events are being passed in the current fn call
        balance = str(new_balance[iter])
        
        # Check For Non-Standard Events
        standard = std_event(session[iter])
        
        # Format Datetime Objects
        date = datetime.strftime(dates[iter], "%m-%d-%y")
        
        # Add Dates to Row
        descrip_table.add(TableCell(Paragraph(date), background_color=even_color))
        # Add Event Type
        descrip_table.add(
            TableCell(Paragraph(str(session[iter])), background_color=even_color)
        )
        # Add Event Duration
        if(not standard):
            descrip_table.add(TableCell(Paragraph(" "), background_color=even_color))
        else:
            descrip_table.add(
                TableCell(Paragraph(str(durations[iter])), background_color=even_color)
            )
        # Add Event Rate
        if(not standard):
            descrip_table.add(TableCell(Paragraph(" "), background_color=even_color))
        else:
            descrip_table.add(
                TableCell(Paragraph("$ " + hourly_rate), background_color=even_color)
            )
        # Add Event Cost
        descrip_table.add(
            TableCell(Paragraph("$ " + amount), background_color=even_color)
        )
        # Add Balance After Event
        descrip_table.add(
            TableCell(Paragraph("$ " + balance), background_color=even_color)
        )
        iter += 1

    # If alloted lines is less than the max space
    # Available, fill remaining space with empty rows
    print(rows, iter)
    if iter < rows:
        for row_number in range(iter + 1, rows):
            col_iter = 0
            while col_iter < 6:
                descrip_table.add(
                    TableCell(Paragraph(" "), background_color=even_color)
                )
                col_iter += 1
                if col_iter == 5 and row_number == rows:
                    descrip_table.add(Paragraph("Running Balance: %s" % balance))
                    break
    
    # Set padding on all cells 
    descrip_table.set_padding_on_all_cells(
        Decimal(4), Decimal(4), Decimal(4), Decimal(4)
    )
    descrip_table.no_borders()
    return descrip_table


def generate_statement(CLIENT, PROV, DATES, TYPES, DURATIONS, RATES, AMOUNTS, BALANCE, MULTIPAGE):
    name = CLIENT['clientname']
    print(name)
    
    # Initializing Statement..
    pdf = Document()
    page = Page()
    pdf.append_page(page)
    page_layout = SingleColumnLayout(page)
    page_layout.vertical_margin = page.get_page_info().get_height() * Decimal(0.02)

    # Append Statement Header
    page_layout.add(_build_statment_header(PROV, CLIENT))
    page_layout.add(_build_billing_table())
    
    # If single paged - build single description table 
    if(not MULTIPAGE):
        page_layout.add(
            _description_table(22, TYPES, DATES, DURATIONS, RATES, AMOUNTS, BALANCE)
        )
    # Two paged
    elif(len(DATES) < 52):
        # Add 16 events to page 1
        page_layout.add(
            _description_table(22, TYPES[0:20], DATES[0:20], DURATIONS[0:20], RATES[0:20], AMOUNTS[0:20], BALANCE[0:20])
        )
        # Create and Initialize Second Page
        page2 = Page()
        pdf.append_page(page2)
        page2_layout = SingleColumnLayout(page2)
        page2_layout.vertical_margin = page2.get_page_info().get_height() * Decimal(0.02)
        # Add the rest of the events
        page2_layout.add(
            _description_table(33, TYPES[20:], DATES[20:], DURATIONS[20:], RATES[20:], AMOUNTS[20:], BALANCE[20:])
        )
    else:
        # Add 16 events to page 1
        page_layout.add(
            _description_table(22, TYPES[0:20], DATES[0:20], DURATIONS[0:20], RATES[0:20], AMOUNTS[0:20], BALANCE[0:20])
        )
        # Create and Initialize Second Page
        page2 = Page()
        pdf.append_page(page2)
        page2_layout = SingleColumnLayout(page2)
        page2_layout.vertical_margin = page2.get_page_info().get_height() * Decimal(0.02)
        # Add the rest of the events
        page2_layout.add(
            _description_table(33, TYPES[20:52], DATES[20:52], DURATIONS[20:52], RATES[20:52], AMOUNTS[20:52], BALANCE[20:52])
        )
        # Create and Initialize Third Page
        page3 = Page()
        pdf.append_page(page3)
        page3_layout = SingleColumnLayout(page3)
        page3_layout.vertical_margin = page3.get_page_info().get_height() * Decimal(0.02)
        # Add the rest of the events
        page3_layout.add(
            _description_table(33, TYPES[52:], DATES[52:], DURATIONS[52:], RATES[52:], AMOUNTS[52:], BALANCE[52:])
        )
        
        
        
    # Local path
    with open(f'public/invoices/{name}.pdf', 'wb') as pdf_file:
        PDF.dumps(pdf_file, pdf)
   
   
    """# Heroku path
    with open(f"/app/public/invoices/{cli}.pdf", "wb") as pdf_file:
        PDF.dumps(pdf_file, pdf) """
        
    