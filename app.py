from flask import Flask, render_template, request, jsonify
import requests
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check_availability', methods=['POST'])
def check_availability():
    # Retrieve form data from the request
    data = request.get_json()

    # Retrieve form data from the JSON data
    train_no = data.get('trainNo')
    source = data.get('source')
    destination = data.get('destination')
    journey_date = data.get('journeyDate').replace('-', '')
    selected_class = data.get('class')
    quota = data.get('quota')
    # print(request.form)
    # train_no = request.form.get('trainNo')
    # source = request.form.get('source')
    # destination = request.form.get('destination')
    # journey_date = request.form.get('journeyDate').replace('-', '')
    # selected_class = request.form.get('class')
    # quota = request.form.get('quota')

    url = f"https://www.irctc.co.in/eticketing/protected/mapps1/avlFarenquiry/{train_no}/{journey_date}/{source}/{destination}/{selected_class}/{quota}/N"
    
    payload = json.dumps({
                "paymentFlag": "N",
                "concessionBooking": False,
                "ftBooking": False,
                "loyaltyRedemptionBooking": False,
                "ticketType": "E",
                "quotaCode": quota,
                "moreThanOneDay": True,
                "trainNumber": "12791",
                "fromStnCode": source,
                "toStnCode": destination,
                "isLogedinReq": True,
                "journeyDate": journey_date,
                "classCode": selected_class
            })
    
    headers = {
        'greq': '1682759684180',
        'Content-Type': 'application/json',
        'bmirak': 'webbm'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)

    return response.text

if __name__ == '__main__':
    app.run(debug=True)
