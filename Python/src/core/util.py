from borb.pdf.canvas.layout.text.paragraph import Paragraph
from borb.pdf.canvas.layout.table.fixed_column_width_table import (
    FixedColumnWidthTable as Table,
)

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
