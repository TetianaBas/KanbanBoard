#auth.py
from flask import Blueprint, request, redirect, render_template, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from models import User
from flask_login import login_user
from flask import jsonify
from extensions import db 

bp = Blueprint('auth', __name__)

@bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        if email == None or password == None:
            return jsonify({"message": "Provide your data"}), 400
        try:
            user = User.query.filter_by(email=email).first()
            if user:
                return jsonify({"message": "Email address already exists"}), 400
        except: 
            print('errrorRRRR')
            pass

        new_user = User(email=email, password=generate_password_hash(password, method='pbkdf2:sha1'))
        db.session.add(new_user)
        db.session.commit()
    return jsonify({"ok": True}), 200

@bp.route('/login', methods=['POST'])
def login():
    # Example of handling login with JSON
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"message": "Login successful", "user": {"email": email}}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@bp.route('/api/login_status')
def login_status():
    is_logged_in = current_user.is_authenticated
    return jsonify({'isLoggedIn': is_logged_in})