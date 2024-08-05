from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许所有来源

@app.route('/api/getDoctorReply', methods=['POST'])
def get_doctor_reply():
    data = request.json
    # 处理请求并返回响应
    return jsonify({'reply': '这是医生的回复'})


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
