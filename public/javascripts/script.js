$('#eventTypeSelector').on('change', function(){
    var selection = $(this).val();

    if (selection !== 'refund' && selection !== 'retainer'){
        $("#amountField").hide()
        $("#amountField").val(0)
        $("#hrsField").show()
        $("#minField").show()
        $("#rateField").show()
    } else if (selection == 'retainer' || selection == 'refund') {

        $("#hrsField").hide()
        $("#minField").hide()
        $("#rateField").hide()
        $("#hrsField").val(0)
        $("#minField").val(0)
        $("#rateField").val(0)
        $("#amountField").show()

    }

    else {
        $("#hrsField").hide()
        $("#minField").hide()
        $("#rateField").hide()
        $("#amountField").hide()
        $("#hrsField").val(0) 
        $("#minField").val(0) 
        $("#rateField").val(0) 
        $("#amountField").val(0) 
   }
});

$('#addEvent').on('click', function() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    
    var yyyy = today.getFullYear();
    if(dd<10){
        
        dd='0'+dd
    
    } 
    if(mm<10){
        
        mm='0'+mm
    
    } 
    
    today = mm+'/'+dd+'/'+yyyy;
    
    $('#datePicker').valueAsDate('value', today);


})