
// make the event form fields appear depending on event type selection

$('#eventTypeSelector').on('change', function(){
    var selection = $(this).val();

    // New event types : Meeting, Email, Phone Call, General, Retainer, Refund

    const chargeTypes = ['Meeting', 'Email', 'Phone Call', 'General']

    // should show for everything but Retainer / Refund 
    if (chargeTypes.includes(selection)){
        $("#amountField").hide()
        $("#amountField").val(0)
        $("#hrsField").show()
        $("#minField").show()
        $("#rateField").show()
        $("#detailField").show()
    } else if (selection == 'Retainer' || selection == 'Refund') {

        $("#hrsField").hide()
        $("#minField").hide()
        $("#rateField").hide()
        $("#hrsField").val(0)
        $("#minField").val(0)
        $("#rateField").val(0)
        $("#amountField").show()
        $("#detailField").hide()

    } else if(selection == 'Other') {
        $("#amountField").show()
        $("#amountField").val(0)
        $("#hrsField").show()
        $("#minField").show()
        $("#rateField").show()
        $("#detailField").show()
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
        $("#detailField").hide()
   }
});

// makes client rows clickable 
$('.client-row').on('click', function(){

    window.location = $(this).data('href');

})

// making events row on the table clickeable for editing
$('.eventRow').on('click', function() {
   window.location = $(this).data('href');
})

// register button redirect to sign up page
$('#registerBtn').on('click', function() {
    window.location = $(this).data('href');
 })
 

// makes the statement modal disappear after 3 seconds
$('#downloadBtn').on('click', function() {

    setTimeout(function() {$('#statementModal').modal('hide');}, 3000);

  });

  
  // validate event form input
$(function() {

let hrs = parseFloat($('#hrsField').val());
let mins = parseFloat($('#minField').val());

$("#eventForm").validate({

    rules: {

        date: required,
        minutes: {
            required: true,
            min: {
                param: 0.1,
                depends: function(){
                
                    return $('#hrsField').val() == 0;

                }
            }
        }

        },
    
    messages: {

        date: "Please enter a date",
        minutes: "You must enter some time for the event"

    }

    })
});


// parse the duration field back into hours and minutes for the event editing page
let duration = $('#ghostDivDurationInfo').attr('value');
let hrVal = Math.floor(duration)
let minVal = (duration - hrVal).toFixed(1)
let typeVal = $('#ghostDivTypeInfo').attr('value');

console.log(hrVal + "  " + minVal)

$(`#hrsFieldEdit option[value=${hrVal}]`).attr('selected', 'selected')
$(`#minFieldEdit option[value=${minVal * 10}]`).attr('selected', 'selected') // need to be sure to divide by 10 on edit post

$('#hrsFieldEdit').on('click', function() {

    $(`#hrsFieldEdit option[value=${hrVal}]`).attr('selected', false)

})

$('#minFieldEdit').on('click', function() {

    $(`#minFieldEdit option[value=${minVal * 10}]`).attr('selected', false)

})

$(`#eventTypeEdit option[value=${typeVal}]`).attr('selected','selected')

$('#eventTypeEdit').on('change', function() {

    var selection = $(this).val();

    if (selection !== 'Retainer' && selection !== 'Refund') {
        $('#hrsFieldEdit').hide();
        $('#minFieldEdit').hide();
        $('#amountFieldEdit').show()
    } else {
        $('#hrsFieldEdit').show();
        $('#minFieldEdit').show();
        $('#amountFieldEdit').hide();
    }

})
