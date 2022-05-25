script syntax: 

python3 main.py '2020-10-10' '2020-10-20' '{
    "clientname": "Jack Gallucci",
    "billingAdd": "129 waverly ct, Martinez, CA 94553",
    "mailingAdd": "",
    "phone": "9253301243"
}' '[
    {
        "_id": "61a9b2c6f5b4111720d42b9c",
        "clientID": "61a9b2b0f5b4111720d42b94",
        "date": "2021-11-18T00:00:00.000Z",
        "type": "Meeting",
        "detail": "",
        "duration": 3,
        "rate": 45,
        "amount": {
            "$numberDecimal": "-135.00"
        },
        "newBalance": {
            "$numberDecimal": "-135.00"
        },
        "__v": 0
    },
    {
        "_id": "61a9c81eeb54c91e19fea4fa",
        "clientID": "61a9b2b0f5b4111720d42b94",
        "date": "2021-12-03T00:00:00.000Z",
        "type": "Phone Call",
        "detail": "",
        "duration": 9,
        "rate": 100,
        "amount": {
            "$numberDecimal": "-900.00"
        },
        "newBalance": {
            "$numberDecimal": "-1035.00"
        },
        "__v": 0
    }
]'