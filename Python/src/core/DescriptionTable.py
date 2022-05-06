from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal

from borb.pdf.canvas.layout.table.fixed_column_width_table import (
    FixedColumnWidthTable as Table,
)
from borb.pdf.canvas.layout.text.paragraph import Paragraph
from borb.pdf.canvas.layout.layout_element import Alignment
from borb.pdf.canvas.color.color import HexColor, X11Color
from borb.pdf.canvas.layout.table.table import TableCell

from util import table_space, ensure_payment_info, phone_formatter, std_event


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
            reflected = f"{balance}"
            self.table.add(
                TableCell(Paragraph("$ " + balance), background_color=even_color)
            )

        # If alloted lines is less than the max available, fill remaining lines with empty rows
        if self.size < self.rows:
            for row_number in range(self.size + 1, self.rows):
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
