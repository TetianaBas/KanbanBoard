#tasks.py
from flask import Blueprint, request, jsonify, redirect, render_template, url_for
from flask_login import login_required, current_user
from models import Task
from extensions import db

bp = Blueprint('tasks', __name__)

@bp.route('/')
@login_required
def home():
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    jsonify({'message': 'ok'}), 200


@bp.route('/tasks', methods=['GET'])
@login_required
def list_tasks():
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    tasks_data = [{'id': task.id, 'title': task.title, 'status': task.status, 'parent_id':task.parent_id} for task in tasks] 
    print(tasks_data, type(tasks_data))
    return jsonify(tasks_data), 200



@bp.route('/add_task', methods=['POST'])
@login_required
def add_task():
    data = request.get_json()  # sending a JSON payload
    title = data.get('title')
    parent_id = data.get('parent_id')

    # If it's a subtask, find the parent and set the same status
    if parent_id:
        parent_task = Task.query.get(parent_id)
        status = parent_task.status if parent_task else 'To Do'
    else:
        status = data.get('status')

    new_task = Task(title=title, status=status, user_id=current_user.id, parent_id=parent_id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task added successfully'}), 201

def find_subtasks(task):
    # recursively delete sub tasks of the task 
    for subtask in task.subtasks:
        db.session.delete(subtask)
        find_subtasks(subtask)

@bp.route('/complete_task/<task_id>', methods=['POST'])
@login_required
def complete_task(task_id):
    task = Task.query.get(task_id)
    if task and task.owner.id == current_user.id:

        # loop subtasks
        find_subtasks(task)
        # when sub tasks deleted - delete the parent task 
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task completed successfully'}), 200
    return jsonify({'error': 'Task not found or unauthorized access'}), 404

@bp.route('/update_task/<task_id>', methods=['POST'])
@login_required
def update_task(task_id):
    data = request.get_json() 
    new_title = data.get('title')
    task = Task.query.get(task_id)
    if task and task.owner.id == current_user.id:
        task.title = new_title
        db.session.commit()
        return jsonify({'message': 'Task updated successfully'}), 200
    return jsonify({'error': 'Task not found or unauthorized access'}), 404

@bp.route('/toggle_collapse/<task_id>', methods=['POST'])
@login_required
def toggle_collapse(task_id):
    task = Task.query.get(task_id)
    if task and task.owner.id == current_user.id:
        task.collapsed = not task.collapsed
        db.session.commit()
        return jsonify({'message': 'Task collapse status toggled successfully'}), 200
    return jsonify({'error': 'Task not found or unauthorized access'}), 404

@bp.route('/move_task/<task_id>', methods=['POST'])
@login_required
def move_task(task_id):
    data = request.get_json()  # 
    new_status = data.get('new_status')  # getting the new status from the JSON body
    task = Task.query.get(task_id)
    if task and task.owner.id == current_user.id:
        task.status = new_status  # Update the task's status with the new status
        db.session.commit()
        return jsonify({'message': 'Task moved successfully'}), 200
    return jsonify({'error': 'Task not found or unauthorized access'}), 404

