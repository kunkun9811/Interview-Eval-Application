from flask import Flask, request, make_response, jsonify

import json
import pandas as pd
app = Flask(__name__)

def writeToFile(article, filename):
    f = open(filename, "w");
    f.write(article)
    f.close

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
        
        writeToFile(article, "testarticle.txt")

        print("written to file")
        res = make_response(jsonify({"message": "YAY"}), 200)
        return res
