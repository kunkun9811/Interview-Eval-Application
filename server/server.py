from flask import Flask, request, make_response, jsonify
import json
import pandas as pd
app = Flask(__name__)

def writeToFile(article, fileName):
    f = open(fileName, "w");
    f.write(article)
    f.close()

def generateSummary(fileName):
    f = open(fileName, "r")
    message = f.readline()
    f.close()
    print 
    return message[:35]

@app.route('/')
def hello_world():
    return 'Hello, World'

@app.route('/datatext', methods=['POST'])
def upload_file():
    fileName = "testarticle.txt"
    if request.method == 'POST':
        # data will be json of the form {1: "p1", 2: "p2"}
        #convert into dictionary
        text = json.loads(request.data)
        print(text['0'])
        article = ""
        for key, value in text.items():
            article += value + " "
        
        writeToFile(article, fileName)

        print("written to file")
        message = generateSummary(fileName)
        res = make_response(jsonify({"message": message}), 200)
        return res
