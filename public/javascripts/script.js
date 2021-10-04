$('#eventTypeSelector').on('change', function(){
    var selection = $(this).val();

    const meetingTypes = ['1:1 Meeting', '3 Way Meeting', '4 Way Meeting', '5 Way Meeting', '6 Way Meeting', '7 Way Meeting', 'Team Meeting']
    const miscTypes = ['Emails', 'Intention Statement', 'Notes', 'Parenting Plan', 'Phone Call', 'Travel Time']

    if (meetingTypes.includes(selection) || miscTypes.includes(selection)){
        $("#amountField").hide()
        $("#amountField").val(0)
        $("#hrsField").show()
        $("#minField").show()
        $("#rateField").show()
    } else if (selection == 'Retainer' || selection == 'Refund') {

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

// making events row on the table clickeable for editing
$('.eventRow').on('click', function() {
    window.location = $(this).data('href');
})

/* download button redirect to dashboard 
$('#downloadBtn').on('click', () => {

    window.location.href = '/user/dashboard';

});
*/

$('#downloadBtn').on('click', function() {

    setTimeout(function() {$('#statementModal').modal('hide');}, 4000);

  });
  