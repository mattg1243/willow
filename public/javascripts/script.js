
// make the event form fields appear depending on event type selection

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
let duration = $('#ghostDivEventInfo').attr('value');
let hrVal = Math.floor(duration)
let minVal = (duration - hrVal).toFixed(1)

console.log(hrVal + "  " + minVal)

$(`#hrsFieldEdit option[value=${hrVal}]`).attr('selected', 'selected')
$(`#minFieldEdit option[value=${minVal * 10}]`).attr('selected', 'selected') // need to be sure to divide by 10 on edit post

$('#hrsFieldEdit').on('click', function() {

    $(`#hrsFieldEdit option[value=${hrVal}]`).attr('selected', false)

})

$('#minFieldEdit').on('click', function() {

    $(`#minFieldEdit option[value=${minVal * 10}]`).attr('selected', false)

})
