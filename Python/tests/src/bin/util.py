# General
import random       
import pymongo    
from decimal import Decimal      
from pprint import pprint           
from bson import ObjectId   
from datetime import datetime        
# For PDF Handling 
from borb.pdf.pdf import PDF
from borb.pdf.page.page import Page
from borb.pdf.document import Document
from borb.pdf.canvas.layout.page_layout.multi_column_layout import SingleColumnLayout
from borb.pdf.canvas.layout.table.fixed_column_width_table import FixedColumnWidthTable as Table
from borb.pdf.canvas.layout.text.paragraph import Paragraph
from borb.pdf.canvas.layout.layout_element import Alignment
from borb.pdf.canvas.layout.image.image import Image
from borb.pdf.canvas.color.color import HexColor, X11Color
from borb.pdf.canvas.layout.table.table import TableCell
from logger import _set_log_params



# Defines logging params
logger = _set_log_params()



# Defines Mongo Cluster
def _mongo_cluster():
    cluster = "mongodb+srv://mattg1243:chewyvuitton@main-cluster.5pmmm.mongodb.net/maindb?w=majority"
    return cluster

# Defines Mongo Client Instance
def _mongo_client(cluster):
    client = pymongo.MongoClient(cluster, document_class=dict)
    return client

# Defines Instance Criteria
def _set_crit(clientID, FROM, TO):
    criteria = {'clientID': ObjectId(clientID),'$and': [{'date': {'$gte': FROM, '$lte': TO}}]}
    return criteria

# Converts to Decimal from Decimal128
def convert_from_d28(amounts, length_amounts):
    x = 0
    while(x < length_amounts):
        amounts[x] = amounts[x].to_decimal()
        x += 1
    return amounts

# Sums all Decimal Objects
def calc_amounts(amounts, length_amounts):
        total = Decimal()
        x = 0
        
        while(x < length_amounts):
            total += amounts[x]
            x += 1
        return total



# Verify ObjectIDs match system arguments
def _verify_object(clientID, ID):
    verified = False if ObjectId(ID) != ObjectId(clientID) else True
    return verified


# Defines Record Handling Methods
def _record_handling(all_records, clientID, clientNAME):
        # initialize buffers
        # ------------------
        IDs = []

        # holds all dates
        dates = []
    
        # holds all types
        types = []

        # holds all durations
        durations = []

        # holds all rates
        rates = []

        # holds all amounts
        amounts = []

        # holds new balance
        new_balance = []

        counter = 0

        # Loop through data gathered
        # Verify ObjectIds
        for row in all_records:
            try:
                _verify_object(clientID, row['clientID'])
            except Exception as _verify_objectID_error_handler:
                print('Exception thrown verifying Clients ObjectId %s' % _verify_objectID_error_handler)
            try:    
                dates.append(row['date'])
                types.append(row['type'])
                durations.append(row['duration'])
                rates.append(row['rate'])
                amounts.append(row['amount'])
                new_balance.append(row['newBalance'])
                counter += 1
            except Exception as _data_appending_error_handler:
                print('Exception thrown appending data fetched to buffers %s' % _data_appending_error_handler)

        length_amounts = len(amounts)
        #debug_print(IDs, dates, types, rates, amounts, durations)


        # Convert list of amounts to working Decimal values
        amounts = convert_from_d28(amounts, length_amounts)
    
        #print("Amounts after conversion method: \n")
        #print(type(amounts[0]))
       # print(amounts, '\n')
        
        total = calc_amounts(amounts, length_amounts)
       # print("Total values after Decimal object summing: \n")
       # print(type(total))
       # print(total , '\n')
        generate(clientNAME, dates, types, durations, rates, amounts, new_balance)


# Debug 
def debug_print(IDs, DATES, TYPES, RATES, AMOUNTS, DURATIONS):
    print('\n')
    print(IDs)
    print('\n')
    print('Dates:\n')
    pprint(DATES)
    print('\n')
    print('Types:\n')
    pprint(TYPES)
    print('\n')
    print('Rates:\n')
    pprint(RATES)
    print('\n')
    print('Amounts:\n')
    pprint(AMOUNTS)
    print('\n')
    print('Durations:\n')
    pprint(DURATIONS)
    print('\n')



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
    header.add(Paragraph("Date Issued:", font="Helvetica-Bold", horizontal_alignment=Alignment.RIGHT))
    now = datetime.now()
    header.add(Paragraph("%d/%d/%d" % (now.month, now.day, now.year)))
    # City
    header.add(Paragraph("San Francisco, Ca"))
    # Invoice ID ---- Serves no purpose for now
    header.add(Paragraph("Invoice #", font="Helvetica-Bold", horizontal_alignment=Alignment.RIGHT))
    header.add(Paragraph("%d" % random.randint(1000, 10000)))
    # Due Date 
    header.add(Paragraph(" "))
    header.add(Paragraph("Due Date", font="Helvetica-Bold", horizontal_alignment=Alignment.RIGHT))
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
    total = calc_amounts(amounts, length_of_events)

    descrip_table = Table(number_of_rows=15, number_of_columns=6)
    for h in ["DATE", "TYPE", "DURATION", "RATE", "AMOUNT", "BALANCE"]:
        descrip_table.add(
            TableCell(
                Paragraph(h, horizontal_alignment=Alignment.LEFT, font_color=X11Color("White"), font_size=10, font="Helvetica"),
                background_color=HexColor("000000"),
                padding_top=Decimal(10)
            )
        )
        

    # black
    odd_color = HexColor("BBBBBB")
    # white
    even_color = HexColor("FFFFFF")

    # This loop can be improved
    count = 0
   
    while(count < length_of_events):
        hourly_rate = str(hourly[count])
        amount = str(amounts[count])
        balance = str(new_balance[count])
        date = datetime.strftime(dates[count], "%m-%d-%y")
        descrip_table.add(TableCell(Paragraph(date), background_color=even_color))
        descrip_table.add(TableCell(Paragraph(str(session[count])), background_color=even_color))
        descrip_table.add(TableCell(Paragraph(str(durations[count])), background_color=even_color))
        descrip_table.add(TableCell(Paragraph("$ " + hourly_rate), background_color=even_color))
        descrip_table.add(TableCell(Paragraph("$ " + amount), background_color=even_color))
        descrip_table.add(TableCell(Paragraph("$ " + balance), background_color=even_color))
        count += 1

  # print(count)
    # If alloted lines is less than the max space
    # Available, fill remaining space with empty rows
    if(count < 15):
        for row_number in range(count+1, 15):
            col_count = 0
            while(col_count < 6):
                descrip_table.add(TableCell(Paragraph(" "), background_color=even_color))
                col_count += 1
                if(col_count == 5 and row_number == 14):
                    descrip_table.add(Paragraph('Running Balance: %s' % balance))
                    break
            
    descrip_table.set_padding_on_all_cells(Decimal(2), Decimal(2), Decimal(2), Decimal(2))
    descrip_table.no_borders()
    return descrip_table


def generate(CLIENT, DATES, TYPES, DURATIONS, RATES, AMOUNTS, BALANCE):
    cli = CLIENT
    dates = DATES
    types = TYPES
    dur = DURATIONS
    rates = RATES
    amounts = AMOUNTS

    now = datetime.now()
    

    pdf = Document()
    page = Page()
    pdf.append_page(page)
    page_layout = SingleColumnLayout(page)
    page_layout.vertical_margin = page.get_page_info().get_height() * Decimal(0.02)

    # Add image
    # TODO: Implement different Image method:
    #     // Not From Web, but from backend ideally. Zeros risk of erroring if
    #     this url changes or stops operating
    page_layout.add(Image(
            "https://miro.medium.com/max/1400/1*6HdI84r__tiI65f2vhZN1g.png",
            width=Decimal(140),
            height=Decimal(103),
        ),
    )
    
    # Appends
    page_layout.add(_build_statment_header())
    page_layout.add(_build_billing_table(cli))
    page_layout.add(_description_table(TYPES, DATES, DURATIONS, RATES, AMOUNTS, BALANCE))


    with open(f'/app/public/invoices/{cli}.pdf', 'wb') as pdf_file:
        PDF.dumps(pdf_file, pdf)