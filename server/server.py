from flask import Flask, request, make_response, jsonify
import json
import pandas as pd
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World'

@app.route('/datatext', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # data will be json of the form {1: "p1", 2: "p2"}
        #convert into dictionary
        text = json.loads(request.data)
        print(text['0'])
        article = ""
        for key, value in text.items():
            article += value + " "
        res = make_response(jsonify({"message": "YAY"}), 200)
        return res
