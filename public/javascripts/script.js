$('#eventTypeSelector').on('change', function(){
    var selection = $(this).val();

    if (selection !== 'refund' && selection !== 'retainer'){
        $("#timeField").show()
        $("#rateField").show()
    } else if (selection == 'retainer' || selection == 'refund') {

        $("#timeField").hide()
        $("#rateField").hide() 
        $("#amountField").show()

    }

    else {
        $("#timeField").hide()
        $("#rateField").hide()
        $("#notesField").hide()
   }
});