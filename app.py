from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/get_stocks', methods=['POST'])
def get_stocks():
    api_key = "819d185bea314c1da292d780b598ca5f"
    start_date = request.json['startDate']
    end_date = request.json['endDate']
    balance = request.json["balance"]
    values = []
    dict = {}

    for stock in request.json['stocks']:
        stocks = stock["symbol"]
        allocation = stock["allocation"]

        current = requests.get(f"https://api.twelvedata.com/time_series?symbol={stocks}&interval=1day&start_date={start_date}&apikey={api_key}").json()
        if current["status"] == "ok":
            for date in current["values"]:
                values.append({date["datetime"] : date["close"]})
            dict[(stock["symbol"])] = values
        elif current["code"] == 400:
            return "Not a valid stock."
        else:
            return "API limit reached. Please wait a minute."
    return dict

@app.route('/')
def index():
    return "Hello"

if __name__ == '__main__':
    app.run(debug=True)