#models.py
from extensions import db
from flask_login import UserMixin

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    tasks = db.relationship('Task', backref='owner', lazy=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    collapsed = db.Column(db.Boolean, default=False)
    complete = db.Column(db.Boolean, default=False)
    title = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='To Do')  # Reflects the "column" field in the form
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=True)
    subtasks = db.relationship('Task', backref=db.backref('parent', remote_side=[id]), lazy=True)
