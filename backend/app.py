from flask import Flask
from flask_login import LoginManager
from flask_cors import CORS
from extensions import db
from models import User

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your_secret_key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

    CORS(app) 

    db.init_app(app)

    with app.app_context():
        db.create_all()

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        # user_id needs to be converted to int as it's stored in session as a string
        return User.query.get(int(user_id))
    
    with app.app_context():
        import auth
        import tasks
        app.register_blueprint(auth.bp)
        app.register_blueprint(tasks.bp)

    return app

if __name__ == '__main__':
    create_app().run(debug=True)
