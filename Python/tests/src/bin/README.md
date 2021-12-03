script syntax: 

python3 main.py 2020-10-10 2020-10-20 
'{
    "clientname": "Jack Gallucci",
    "billingAdd": "129 waverly ct, Martinez, CA 94553",
    "mailingAdd": "",
    "phone": "9253301243"
}' 
'[
    {
        "_id": "615d51852325bb13f4ac4d31",
        "clientID": "61574effde2acc08d72b5e20",
        "date": "2021-10-06T00:00:00.000Z",
        "type": "Retainer",
        "duration": 0,
        "rate": null,
        "amount": {
            "$numberDecimal": "2000.00"
        },
        "newBalance": {
            "$numberDecimal": "2000.00"
        },
        "__v": 0
    },
    {
        "_id": "6161c07d37eea334b45e5460",
        "clientID": "61574effde2acc08d72b5e20",
        "date": "2021-10-08T00:00:00.000Z",
        "type": "4 Way Meeting",
        "duration": 2,
        "rate": 190,
        "amount": {
            "$numberDecimal": "-380"
        },
        "newBalance": {
            "$numberDecimal": "758.40"
        },
        "__v": 0
    },
        {
        "_id": "61649e217cd58036f657320d",
        "clientID": "61574effde2acc08d72b5e20",
        "date": "2021-10-04T00:00:00.000Z",
        "type": "1:1 Meeting",
        "duration": 1.2,
        "rate": 190,
        "amount": {
            "$numberDecimal": "-228"
        },
        "newBalance": {
            "$numberDecimal": "340.40"
        },
        "__v": 0
    },
    {
        "_id": "61649ea17cd58036f6573215",
        "clientID": "61574effde2acc08d72b5e20",
        "date": "2021-10-04T00:00:00.000Z",
        "type": "5 Way Meeting",
        "duration": 2.2,
        "rate": 190,
        "amount": {
            "$numberDecimal": "-418.00000000000006"
        },
        "newBalance": {
            "$numberDecimal": "-856.60"
        },
        "__v": 0
    }
]
'