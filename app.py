from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('homepage.html')

@app.route('/login')
def login():
    return render_template('loginpage.html')

@app.route('/createAccount')
def createAccount():
    return render_template('createaccountpage.html')
    
if __name__ == '__main__':
    app.run(debug=True)